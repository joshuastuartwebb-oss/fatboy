import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'

export const runtime = 'edge'

export default async function Home() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      redirect('/login')
    }

    // If user is logged in, check if they have a profile (start date set)
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // If no profile or no start date, we need to onboard
    if (!profile || !profile.start_date) {
      return (
        <div className="h-[100dvh] bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
          {/* Background ambient glows */}
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[var(--fatboy-green)] opacity-10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[var(--fatboy-yellow)] opacity-5 blur-[120px] rounded-full pointer-events-none" />

          <div className="w-full max-w-md bg-[var(--fatboy-glass)] backdrop-blur-xl border border-[var(--fatboy-glass-border)] rounded-3xl p-8 shadow-2xl relative z-10">
            <div className="text-center mb-8">
              <Image src="/fatboy-logo.jpg" alt="Fatboy" width={80} height={80} className="rounded-full mx-auto mb-4" />
              <h1 className="text-3xl font-black tracking-tight mb-2 text-white">
                Welcome to FATBOY
              </h1>
              <p className="text-neutral-400 text-sm">
                Begin your 12-week habit tracking journey.
              </p>
            </div>

            <form action={async (formData: FormData) => {
              'use server'
              const supabase = await createClient()
              const { data: { user } } = await supabase.auth.getUser()
              if (!user) return

              const date = formData.get('startDate') as string
              if (!date) return

              // Create or update profile
              const { error } = await supabase.from('profiles').upsert({
                id: user.id,
                email: user.email,
                start_date: new Date(date).toISOString(),
              })

              if (!error) {
                redirect('/')
              }
            }} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 ml-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--fatboy-green)] focus:border-transparent transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[var(--fatboy-green)] hover:bg-[#2ed62b] text-black font-bold py-3.5 rounded-xl transition-all transform active:scale-95 shadow-[0_0_20px_rgba(55,235,52,0.2)] hover:shadow-[0_0_30px_rgba(55,235,52,0.4)]"
              >
                Start My Journey
              </button>
            </form>
          </div>
        </div>
      )
    }

    // Redirect to dashboard
    redirect('/dashboard')
  } catch (error) {
    // If it's a redirect error, rethrow it (it's expected)
    if (error instanceof Error && (error.message === 'NEXT_REDIRECT' || error.message.includes('NEXT_REDIRECT'))) {
      throw error;
    }

    console.error("Home Page Crash:", error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 font-mono">
        <h1 className="text-xl font-bold text-red-500 mb-4">Initial Load Error</h1>
        <div className="bg-neutral-900 p-4 rounded-lg mb-4 max-w-full overflow-auto border border-neutral-800">
          <p className="text-sm text-neutral-300">
            {error instanceof Error ? error.message : JSON.stringify(error)}
          </p>
          {error instanceof Error && error.stack && (
            <pre className="text-[10px] text-neutral-500 mt-2 whitespace-pre-wrap">
              {error.stack}
            </pre>
          )}
        </div>
        <p className="text-neutral-500 text-sm mb-8">Please screenshot this screen.</p>
        <a href="/debug" className="bg-white text-black px-4 py-2 rounded-lg font-bold hover:bg-neutral-200">
          Check Env Vars
        </a>
      </div>
    )
  }
}


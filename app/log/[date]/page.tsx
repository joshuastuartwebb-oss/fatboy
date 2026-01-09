import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import LogForm from './LogForm'
import BackButton from './BackButton'

export default async function LogPage({ params }: { params: Promise<{ date: string }> }) {
    const { date } = await params
    const dateStr = date

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Fetch existing log
    const { data: existingLog } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', dateStr)
        .single()

    return (
        <div className="h-[100dvh] bg-black text-white flex flex-col items-center overflow-hidden relative">
            {/* Background ambient glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-[var(--fatboy-green)] opacity-[0.08] blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-[var(--fatboy-yellow)] opacity-[0.05] blur-[100px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md flex-1 flex flex-col p-4 relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 shrink-0">
                    <BackButton />
                    <h1 className="text-lg font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                        {format(new Date(dateStr), 'EEEE, MMM d')}
                    </h1>
                    <div className="w-14" />
                </div>

                {/* Form Container */}
                <div className="flex-1 overflow-y-auto">
                    <LogForm date={dateStr} initialData={existingLog} />
                </div>
            </div>
        </div>
    )
}


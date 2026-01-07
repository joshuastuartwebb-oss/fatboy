import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardGrid from './components/DashboardGrid'
import StatsOverview from './components/StatsOverview'
import { signout } from '../login/actions'
import { LogOut } from 'lucide-react'
import Image from 'next/image'

export const runtime = 'edge'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!profile || !profile.start_date) {
        redirect('/')
    }



    // Fetch logs
    const { data: logs } = await supabase
        .from('daily_logs')
        .select('date, daily_score')
        .eq('user_id', user.id)
        .gte('date', new Date(profile.start_date).toISOString().split('T')[0])
        .order('date', { ascending: true })

    // Calculate Stats
    const validLogs = logs?.filter(l => l.daily_score !== null) || []
    const totalLogged = validLogs.length

    // 1. % On Track
    const greenDays = validLogs.filter(l => (l.daily_score ?? 0) >= 2).length
    const onTrackPercentage = totalLogged > 0 ? Math.round((greenDays / totalLogged) * 100) : 0

    // 2. Average Score
    const totalScore = validLogs.reduce((acc, l) => acc + (l.daily_score || 0), 0)
    const averageScore = totalLogged > 0 ? totalScore / totalLogged : 0

    // 3. Best Streak
    let bestStreak = 0
    let currentStreak = 0
    // We assume logs are sorted by date from the query. 
    // Note: This simple calculation assumes no gaps in *dates* for a perfect streak check, 
    // but usually users log every day. If they miss a day, it's not a streak.
    // However, just checking strictly consecutive "green" logs in the array is a decent approximation for now.
    // A more robust way checks date continuity, but let's stick to the simple version first as "Best Streak of Logged Days"
    // or better, strict date continuity.

    // Let's do strict date continuity check for streaks
    if (validLogs.length > 0) {
        let lastDate = new Date(validLogs[0].date)
        if ((validLogs[0].daily_score ?? 0) >= 2) currentStreak = 1
        bestStreak = currentStreak

        for (let i = 1; i < validLogs.length; i++) {
            const logDate = new Date(validLogs[i].date)
            const diffTime = Math.abs(lastDate.getTime() - logDate.getTime())
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

            if ((validLogs[i].daily_score ?? 0) >= 2) {
                if (diffDays === 1) {
                    currentStreak++
                } else {
                    if (currentStreak > bestStreak) bestStreak = currentStreak
                    currentStreak = 1
                }
            } else {
                if (currentStreak > bestStreak) bestStreak = currentStreak
                currentStreak = 0
            }
            lastDate = logDate
        }
        if (currentStreak > bestStreak) bestStreak = currentStreak
    }

    return (
        <div className="h-[100dvh] bg-black text-white p-1 flex flex-col items-center overflow-hidden">
            <div className="w-full max-w-[320px] sm:max-w-4xl px-1 mt-1 flex-shrink-0">
                <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                        <Image src="/fatboy-logo.jpg" alt="Fatboy" width={28} height={28} className="rounded-full" />
                        <div className="flex items-baseline gap-1.5">
                            <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white">FATBOY</h1>
                            <p className="text-neutral-500 uppercase tracking-widest text-[7px] sm:text-[10px] font-semibold">Habit Tracker</p>
                        </div>
                    </div>

                    <form action={signout}>
                        <button type="submit" className="p-1 text-neutral-500 hover:text-white transition-colors">
                            <LogOut size={14} />
                        </button>
                    </form>
                </div>

                <StatsOverview
                    onTrackPercentage={onTrackPercentage}
                    bestStreak={bestStreak}
                    averageScore={averageScore}
                    daysLogged={totalLogged}
                />
            </div>

            <div className="flex-1 w-full flex items-start justify-center overflow-hidden pb-1">
                <DashboardGrid startDate={profile.start_date} logs={logs || []} />
            </div>
        </div>
    )
}

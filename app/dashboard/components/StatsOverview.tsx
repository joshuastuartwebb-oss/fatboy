'use client'

import clsx from 'clsx'
import { motion } from 'framer-motion'

type StatsProps = {
    onTrackPercentage: number
    bestStreak: number
    averageScore: number
    daysLogged: number
}

export default function StatsOverview({ onTrackPercentage, bestStreak, averageScore, daysLogged }: StatsProps) {
    const stats = [
        {
            label: "% ON TRACK",
            value: `${onTrackPercentage}%`,
            sub: "Consistency",
            color: "text-[var(--fatboy-green)]"
        },
        {
            label: "BEST STREAK",
            value: bestStreak,
            sub: "Days",
            color: "text-[var(--fatboy-yellow)]"
        },
        {
            label: "AVG SCORE",
            value: averageScore.toFixed(1),
            sub: "Daily Perf.",
            color: "text-white"
        }
    ]

    return (
        <div className="grid grid-cols-3 gap-1 sm:gap-4 w-full max-w-lg mx-auto mb-3 sm:mb-8">
            {stats.map((stat, i) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-[rgba(20,20,20,0.6)] backdrop-blur-md border border-neutral-800 rounded-lg sm:rounded-2xl p-1.5 sm:p-4 flex flex-col items-center justify-center text-center shadow-lg"
                >
                    <span className="text-[8px] sm:text-xs font-bold text-neutral-500 tracking-wider mb-0.5">{stat.label}</span>
                    <span className={clsx("text-lg sm:text-3xl font-black tracking-tight", stat.color)}>
                        {stat.value}
                    </span>
                    {/* <span className="text-[10px] text-neutral-600 font-medium mt-1">{stat.sub}</span> */}
                </motion.div>
            ))}
        </div>
    )
}

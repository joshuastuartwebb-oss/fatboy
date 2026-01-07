'use client'

import { generateGrid, GRID_DAYS } from '@/utils/grid'
import { motion } from 'framer-motion'
import Link from 'next/link'
import clsx from 'clsx'

type DayLog = {
    date: string
    daily_score: number | null
}

export default function DashboardGrid({ startDate, logs }: { startDate: string, logs: DayLog[] }) {
    const gridDays = generateGrid(new Date(startDate))

    // Create a map for quick access
    const logsMap = new Map(logs.map(log => [log.date, log.daily_score]))

    // Group into weeks
    const weeks = []
    for (let i = 0; i < gridDays.length; i += 7) {
        const weekDays = gridDays.slice(i, i + 7)
        // Calculate Average
        let totalScore = 0
        let count = 0
        weekDays.forEach(day => {
            const score = logsMap.get(day.isoDate)
            if (score !== undefined && score !== null) {
                totalScore += score
                count++
            }
        })
        const average = count > 0 ? (totalScore / count).toFixed(1) : null

        weeks.push({ days: weekDays, average })
    }

    // Streak Calculation Logic for Highlighting
    const streakIndices = new Set<number>()
    let currentStreak: number[] = []

    gridDays.forEach((day, index) => {
        const score = logsMap.get(day.isoDate)
        if (score !== undefined && score !== null && score >= 2) {
            currentStreak.push(index)
        } else {
            if (currentStreak.length > 1) {
                currentStreak.forEach(i => streakIndices.add(i))
            }
            currentStreak = []
        }
    })
    if (currentStreak.length > 1) {
        currentStreak.forEach(i => streakIndices.add(i))
    }

    // Get average color based on value
    const getAverageColor = (avg: string | null) => {
        if (!avg) return { bg: "bg-neutral-900", text: "text-neutral-700", border: "border-neutral-800" }
        const num = parseFloat(avg)
        if (num >= 2) return { bg: "bg-transparent", text: "text-[var(--fatboy-green)]", border: "border-[var(--fatboy-green)]/50" }
        if (num >= 0) return { bg: "bg-transparent", text: "text-[var(--fatboy-yellow)]", border: "border-[var(--fatboy-yellow)]/50" }
        return { bg: "bg-transparent", text: "text-[var(--fatboy-red)]", border: "border-[var(--fatboy-red)]/50" }
    }

    return (
        <div className="w-full max-w-[340px] sm:max-w-4xl mx-auto px-1 sm:px-4">
            <div className="space-y-1.5 sm:space-y-3">
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-cols-8 gap-1 sm:gap-3">
                        {/* 7 Day Dots */}
                        {week.days.map((day, dayIndex) => {
                            const globalIndex = weekIndex * 7 + dayIndex
                            const score = logsMap.get(day.isoDate)
                            const hasLog = score !== undefined && score !== null

                            // Style determination
                            let colorClass = "bg-neutral-900"
                            let textClass = "text-transparent"
                            let glowClass = ""

                            if (hasLog) {
                                textClass = "text-black font-bold"
                                if (score! >= 2) {
                                    colorClass = "bg-[var(--fatboy-green)]"
                                    glowClass = "shadow-[0_0_12px_rgba(55,235,52,0.4)]"
                                } else if (score! >= 0) {
                                    colorClass = "bg-[var(--fatboy-yellow)]"
                                    glowClass = "shadow-[0_0_12px_rgba(238,242,2,0.4)]"
                                } else {
                                    colorClass = "bg-[var(--fatboy-red)]"
                                    textClass = "text-white font-bold"
                                    glowClass = "shadow-[0_0_12px_rgba(234,11,11,0.4)]"
                                }
                            } else if (day.isFuture) {
                                colorClass = "bg-neutral-950 opacity-40"
                            } else if (!day.isToday && !hasLog && !day.isFuture) {
                                colorClass = "bg-black border border-neutral-800"
                            }

                            const isStreak = streakIndices.has(globalIndex)

                            return (
                                <Link
                                    key={day.isoDate}
                                    href={day.isFuture ? '#' : `/log/${day.isoDate}`}
                                    className={clsx(
                                        "aspect-square relative flex items-center justify-center rounded-full transition-all duration-200",
                                        day.isFuture ? "cursor-default" : "hover:scale-110 cursor-pointer active:scale-95"
                                    )}
                                >
                                    {isStreak && (
                                        <div className="absolute inset-[-3px] border-2 border-white/60 rounded-full z-0 pointer-events-none" />
                                    )}

                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: globalIndex * 0.003, duration: 0.2 }}
                                        className={clsx(
                                            "w-full h-full rounded-full flex items-center justify-center text-[10px] sm:text-lg font-semibold relative z-10",
                                            colorClass,
                                            textClass,
                                            glowClass
                                        )}
                                    >
                                        {hasLog ? score : ''}
                                    </motion.div>
                                </Link>
                            )
                        })}

                        {/* 8th Column: Weekly Average */}
                        {(() => {
                            const avgColors = getAverageColor(week.average)
                            return (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: (weekIndex * 7 + 7) * 0.003, duration: 0.2 }}
                                    className={clsx(
                                        "aspect-square rounded-full flex items-center justify-center text-[9px] sm:text-sm font-bold border-2",
                                        avgColors.bg,
                                        avgColors.text,
                                        avgColors.border
                                    )}
                                >
                                    {week.average ?? '-'}
                                </motion.div>
                            )
                        })()}
                    </div>
                ))}
            </div>
        </div>
    )
}


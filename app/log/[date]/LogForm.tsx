'use client'

import { useState, useEffect } from 'react'
import { saveLog } from './actions'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

type Props = {
    date: string
    initialData: any
}

// Question Config
const QUESTIONS = [
    { id: 'drank_water', label: 'Drink 2L of water?', points: 1, type: 'good' },
    { id: 'ran_5k', label: 'Run more than 5km?', points: 1, type: 'good' },
    { id: 'felt_hungry', label: 'Feel hungry today?', points: 1, type: 'good' },
    { id: 'drank_beer', label: 'Have a beer?', points: -1, type: 'bad' },
    { id: 'ate_chips', label: 'Eat chips/bread?', points: -1, type: 'bad' },
    { id: 'ate_choc', label: 'Eat chocolate/sweets?', points: -1, type: 'bad' },
]

export default function LogForm({ date, initialData }: Props) {
    const [answers, setAnswers] = useState<Record<string, boolean>>({})

    useEffect(() => {
        if (initialData) {
            setAnswers({
                drank_water: initialData.drank_water || false,
                ran_5k: initialData.ran_5k || false,
                felt_hungry: initialData.felt_hungry || false,
                drank_beer: initialData.drank_beer || false,
                ate_chips: initialData.ate_chips || false,
                ate_choc: initialData.ate_choc || false,
            })
        }
    }, [initialData])

    // Real-time score calc
    const score = QUESTIONS.reduce((acc, q) => {
        if (answers[q.id]) return acc + q.points
        return acc
    }, 0)

    let scoreColor = "bg-neutral-900 text-neutral-500"
    let scoreGlow = ""
    if (score >= 2) {
        scoreColor = "bg-[var(--fatboy-green)] text-black"
        scoreGlow = "shadow-[0_0_40px_rgba(55,235,52,0.5)]"
    } else if (score >= 0) {
        scoreColor = "bg-[var(--fatboy-yellow)] text-black"
        scoreGlow = "shadow-[0_0_40px_rgba(238,242,2,0.4)]"
    } else {
        scoreColor = "bg-[var(--fatboy-red)] text-white"
        scoreGlow = "shadow-[0_0_40px_rgba(234,11,11,0.5)]"
    }

    const toggle = (id: string) => {
        setAnswers(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const handleSubmit = async (formData: FormData) => {
        const result = await saveLog(formData)
        if (result?.error) {
            alert(result.error) // Simple alert for now, could be better UI
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4 w-full">
            <input type="hidden" name="date" value={date} />

            {/* Score Display */}
            <motion.div
                className="flex justify-center mb-6"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <div className={clsx(
                    "w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-4xl sm:text-5xl font-black transition-all duration-500",
                    scoreColor,
                    scoreGlow
                )}>
                    {score}
                </div>
            </motion.div>

            <div className="space-y-2">
                {QUESTIONS.map((q, index) => {
                    const isActive = answers[q.id] ?? false
                    return (
                        <motion.div
                            key={q.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <input type="checkbox" name={q.id} checked={isActive} readOnly className="hidden" />

                            <button
                                type="button"
                                onClick={() => toggle(q.id)}
                                className={clsx(
                                    "w-full p-3.5 rounded-xl flex items-center justify-between transition-all duration-200 border",
                                    isActive
                                        ? (q.type === 'good'
                                            ? "bg-green-950/40 border-[var(--fatboy-green)]/60"
                                            : "bg-red-950/40 border-[var(--fatboy-red)]/60")
                                        : "bg-neutral-900/60 border-neutral-800 hover:border-neutral-700"
                                )}
                            >
                                <span className={clsx(
                                    "font-medium text-sm",
                                    isActive ? "text-white" : "text-neutral-400"
                                )}>
                                    {q.label}
                                </span>
                                <div className={clsx(
                                    "w-7 h-7 rounded-full flex items-center justify-center transition-all",
                                    isActive
                                        ? (q.type === 'good' ? "bg-[var(--fatboy-green)] text-black" : "bg-[var(--fatboy-red)] text-white")
                                        : "bg-neutral-800 text-neutral-600"
                                )}>
                                    {isActive && <Check size={16} strokeWidth={3} />}
                                </div>
                            </button>
                        </motion.div>
                    )
                })}
            </div>

            <motion.button
                type="submit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full bg-white text-black font-bold py-3.5 rounded-xl text-base hover:bg-neutral-200 transition-all shadow-lg mt-6 active:scale-[0.98]"
            >
                Save Log
            </motion.button>
        </form>
    )
}


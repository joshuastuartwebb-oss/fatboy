import { differenceInDays, addDays, startOfDay, format, isSameDay, isFuture } from 'date-fns'

export const GRID_DAYS = 84 // 12 Weeks

export function generateGrid(startDate: Date) {
    const days = []

    // Normalize start date to beginning of day to avoid time issues
    const start = startOfDay(startDate)

    for (let i = 0; i < GRID_DAYS; i++) {
        const currentDate = addDays(start, i)
        // Just storing essential info
        days.push({
            dayNumber: i + 1,
            date: currentDate,
            isoDate: format(currentDate, 'yyyy-MM-dd'),
            isFuture: isFuture(currentDate) && !isSameDay(currentDate, new Date()), // Today is not future
            isToday: isSameDay(currentDate, new Date())
        })
    }

    return days
}

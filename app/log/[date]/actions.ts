'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function saveLog(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const date = formData.get('date') as string

    // Parse booleans. Checkboxes in forms are "on" if checked, null if not.
    const drank_water = formData.get('drank_water') === 'on'
    const ran_5k = formData.get('ran_5k') === 'on'
    const felt_hungry = formData.get('felt_hungry') === 'on'
    const drank_beer = formData.get('drank_beer') === 'on'
    const ate_chips = formData.get('ate_chips') === 'on'
    const ate_choc = formData.get('ate_choc') === 'on'

    // Calculate Score
    let score = 0
    if (drank_water) score += 1
    if (ran_5k) score += 1
    if (felt_hungry) score += 1
    if (drank_beer) score -= 1
    if (ate_chips) score -= 1
    if (ate_choc) score -= 1

    const { error } = await supabase.from('daily_logs').upsert({
        user_id: user.id,
        date: date,
        drank_water,
        ran_5k,
        felt_hungry,
        drank_beer,
        ate_chips,
        ate_choc,
        daily_score: score
    }, { onConflict: 'user_id, date' })

    if (error) {
        console.error("Error saving log:", error)
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
}

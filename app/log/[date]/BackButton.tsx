'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

export default function BackButton() {
    const router = useRouter()

    return (
        <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-neutral-500 hover:text-white transition-colors text-sm font-medium active:scale-95"
        >
            <ChevronLeft size={18} />
            <span>Back</span>
        </button>
    )
}

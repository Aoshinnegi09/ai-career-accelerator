'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getRole, isLoggedIn } from '@/lib/auth'
import { getDefaultDashboard } from '@/utils/auth'

export default function DashboardEntryPage() {
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login')
      return
    }
    router.replace(getDefaultDashboard(getRole() || 'candidate'))
  }, [router])

  return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading dashboard…</div>
}

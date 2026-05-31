'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LegacyRecruiterDashboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/dashboard/recruiter')
  }, [router])

  return <div className="min-h-screen flex items-center justify-center text-slate-400">Redirecting…</div>
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ensureValidToken, getRole } from '@/lib/auth'
import Navbar from './Navbar'
import AppBackground from './AppBackground'

interface Props {
  children: React.ReactNode
  requiredRole?: 'candidate' | 'recruiter'
}

export default function DashboardLayout({ children, requiredRole }: Props) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    ensureValidToken().then((authed) => {
      if (!mounted) return
      if (!authed) {
        router.replace('/login')
        return
      }
      if (requiredRole && getRole() !== requiredRole) {
        router.replace(getRole() === 'recruiter' ? '/recruiter/dashboard' : '/dashboard')
        return
      }
      setReady(true)
    })
    return () => {
      mounted = false
    }
  }, [requiredRole, router])

  if (!ready) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading dashboard...</div>
  }

  return (
    <div className="min-h-screen relative">
      <AppBackground />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">{children}</main>
    </div>
  )
}

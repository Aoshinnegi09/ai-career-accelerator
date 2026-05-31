'use client'

import { DashboardRole } from '@/types/dashboard'
import { useAuth } from '@/hooks/useAuth'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import AppBackground from '@/components/layout/AppBackground'
import Navbar from '@/components/layout/Navbar'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'

interface Props {
  role: DashboardRole | DashboardRole[]
  title: string
  subtitle?: string
  crumbs?: { label: string; href?: string }[]
  action?: React.ReactNode
  children: React.ReactNode
}

export default function DashboardLayout({ role, title, subtitle, crumbs, action, children }: Props) {
  const roles = Array.isArray(role) ? role : [role]
  const { role: currentRole, loading } = useAuth(roles)

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <AppBackground />
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
          <LoadingSkeleton className="h-24 mb-6" />
          <LoadingSkeleton className="h-80" />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <AppBackground />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <TopBar title={title} subtitle={subtitle} crumbs={crumbs} action={action} />
        <div className="grid md:grid-cols-[16rem_1fr] gap-6 items-start">
          <Sidebar role={currentRole || roles[0]} />
          <section className="space-y-6">{children}</section>
        </div>
      </main>
    </div>
  )
}

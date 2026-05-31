'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { DashboardRole } from '@/types/dashboard'

const menus: Record<DashboardRole, { href: string; label: string }[]> = {
  recruiter: [
    { href: '/dashboard/recruiter', label: 'Overview' },
    { href: '/dashboard/recruiter/jobs', label: 'Job Postings' },
    { href: '/dashboard/recruiter/matches', label: 'Matches' },
    { href: '/dashboard/recruiter/analytics', label: 'Analytics' },
  ],
  candidate: [
    { href: '/dashboard/candidate', label: 'Overview' },
    { href: '/dashboard/candidate/matches', label: 'My Matches' },
    { href: '/dashboard/candidate/skills', label: 'Skills Progress' },
    { href: '/dashboard/candidate/coach', label: 'AI Coach' },
  ],
  applicant: [
    { href: '/dashboard/applicant', label: 'Applications' },
    { href: '/dashboard/candidate/matches', label: 'Match Scores' },
    { href: '/dashboard/candidate/skills', label: 'Skill Gaps' },
  ],
  admin: [{ href: '/admin', label: 'Admin' }],
}

export default function Sidebar({ role }: { role: DashboardRole }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const links = menus[role] || menus.candidate

  const content = (
    <aside className="w-full md:w-64 shrink-0 card h-fit md:sticky md:top-24">
      <p className="text-xs uppercase tracking-wider text-slate-500 mb-3">{role} navigation</p>
      <div className="flex md:flex-col gap-2 overflow-auto">
        {links.map(link => {
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`rounded-lg px-3 py-2 text-sm transition-all ${
                active ? 'nav-link-active' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          )
        })}
      </div>
    </aside>
  )

  return (
    <>
      <button className="md:hidden btn-secondary mb-4" onClick={() => setOpen(!open)}>
        {open ? <X size={16} /> : <Menu size={16} />} Menu
      </button>
      <div className={open ? 'block' : 'hidden md:block'}>{content}</div>
    </>
  )
}

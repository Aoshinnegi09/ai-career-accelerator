'use client'

import { Briefcase, User } from 'lucide-react'

export default function RoleSelector({
  value,
  onChange,
}: {
  value: 'candidate' | 'recruiter'
  onChange: (role: 'candidate' | 'recruiter') => void
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {(['candidate', 'recruiter'] as const).map((role) => {
        const active = value === role
        const Icon = role === 'candidate' ? User : Briefcase
        return (
          <button
            key={role}
            type="button"
            onClick={() => onChange(role)}
            className="flex flex-col items-center gap-2 rounded-xl p-4 transition-all"
            style={{
              border: `1px solid ${active ? '#a78bfa' : 'rgba(99,102,241,0.2)'}`,
              background: active ? 'rgba(167,139,250,0.1)' : 'transparent',
              color: active ? '#c4b5fd' : '#64748b',
            }}
            aria-pressed={active}
          >
            <Icon size={22} color={active ? '#a78bfa' : '#475569'} />
            <span className="text-sm font-medium capitalize">{role}</span>
          </button>
        )
      })}
    </div>
  )
}

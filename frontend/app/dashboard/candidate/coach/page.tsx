'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { coachApi } from '@/lib/api'

// Limit rendered history to keep dashboard load fast while showing recent context.
const MAX_DISPLAYED_MESSAGES = 10

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export default function CandidateCoachDashboardPage() {
  const [history, setHistory] = useState<Message[]>([])

  useEffect(() => {
    coachApi.history().then(r => setHistory(r.data as Message[])).catch(() => setHistory([]))
  }, [])

  return (
    <DashboardLayout role={['candidate', 'applicant']} title="AI Career Coach" subtitle="Actionable suggestions based on your progress and scores" crumbs={[{ label: 'Dashboard', href: '/dashboard/candidate' }, { label: 'Coach' }]}>
      <div className="card">
        <h2 className="font-display text-white font-semibold mb-4">Recent coach conversation</h2>
        {history.length === 0 ? (
          <p className="text-slate-500 text-sm">No coaching messages yet. Start a chat from the Coach page.</p>
        ) : (
          <div className="space-y-3">
            {[...history].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).slice(-MAX_DISPLAYED_MESSAGES).map(message => (
              <div key={message.id} className={`p-3 rounded-lg border ${message.role === 'assistant' ? 'bg-purple-500/10 border-purple-400/30' : 'bg-sky-500/10 border-sky-400/30'}`}>
                <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">{message.role}</p>
                <p className="text-sm text-slate-200">{message.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

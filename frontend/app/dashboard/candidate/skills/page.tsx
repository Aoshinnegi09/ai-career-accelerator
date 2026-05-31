'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import ChartComponent from '@/components/dashboard/ChartComponent'
import { skillsApi } from '@/lib/api'

interface SkillItem {
  id: number
  skill_name: string
  status: 'not_started' | 'in_progress' | 'completed'
}

const STATUS_CLASS: Record<SkillItem['status'], string> = {
  not_started: 'status-pending',
  in_progress: 'status-reviewed',
  completed: 'status-shortlisted',
}

export default function CandidateSkillsDashboardPage() {
  const [skills, setSkills] = useState<SkillItem[]>([])

  useEffect(() => {
    skillsApi.list().then(r => setSkills(r.data as SkillItem[])).catch(() => setSkills([]))
  }, [])

  const chartData = ['not_started', 'in_progress', 'completed'].map(status => ({
    status,
    count: skills.filter(skill => skill.status === status).length,
  }))

  return (
    <DashboardLayout role={['candidate', 'applicant']} title="Skill Progress" subtitle="Visualize progress and close job-relevant skill gaps" crumbs={[{ label: 'Dashboard', href: '/dashboard/candidate' }, { label: 'Skills' }]}>
      <div className="grid xl:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-display text-white font-semibold mb-4">Skills progress breakdown</h2>
          <ChartComponent type="bar" xKey="status" yKey="count" data={chartData} color="#4ade80" />
        </div>
        <div className="card">
          <h2 className="font-display text-white font-semibold mb-4">Skill checklist</h2>
          <div className="space-y-2 max-h-80 overflow-auto pr-2">
            {skills.length === 0 ? (
              <p className="text-slate-500 text-sm">No skill entries yet.</p>
            ) : (
              skills.map(skill => (
                <div key={skill.id} className="p-3 rounded-lg bg-white/5 border border-indigo-500/20 flex justify-between items-center">
                  <span className="text-slate-200 text-sm">{skill.skill_name}</span>
                  <span className={`status-badge ${STATUS_CLASS[skill.status]}`}>
                    {skill.status.replace(/_/g, ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

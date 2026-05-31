'use client'

import Link from 'next/link'
import { Briefcase, Star, GraduationCap, Bell, Target, Lightbulb, ArrowRight } from 'lucide-react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import StatCard from '@/components/dashboard/StatCard'
import StatusBadge from '@/components/dashboard/StatusBadge'
import DataTable from '@/components/dashboard/DataTable'
import ChartComponent from '@/components/dashboard/ChartComponent'
import EmptyState from '@/components/common/EmptyState'
import { useCandidateDashboard } from '@/hooks/useDashboard'
import { formatDate } from '@/utils/formatting'

export default function CandidateDashboardPage() {
  const { data, loading } = useCandidateDashboard()
  const matches = data?.matches || []
  const history = data?.history || []

  return (
    <DashboardLayout
      role={['candidate', 'applicant']}
      title="Candidate Dashboard"
      subtitle="Track resume quality, job matches, and career progression"
      crumbs={[{ label: 'Dashboard' }, { label: 'Candidate' }]}
      action={<Link href="/score" className="btn-secondary">Analyze resume <ArrowRight size={14} /></Link>}
    >
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Resume score" value={history[0]?.score || 0} subtitle="Latest analysis" icon={Target} color="#a78bfa" />
        <StatCard title="Match opportunities" value={matches.length} icon={Briefcase} color="#38bdf8" />
        <StatCard title="Skills completed" value={data?.skillsCompleted || 0} icon={GraduationCap} color="#4ade80" />
        <StatCard title="Unread updates" value={data?.notifications || 0} icon={Bell} color="#fbbf24" />
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-display font-semibold text-white mb-4">Job matches & recommendations</h2>
          {matches.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No job matches yet"
              description="Upload resumes and score them to receive AI-powered match recommendations."
              actionLabel="Browse jobs"
              actionHref="/jobs"
            />
          ) : (
            <DataTable
              rows={matches.slice(0, 6)}
              columns={[
                { key: 'job_title', header: 'Role', render: row => row.job_title || `Job #${row.job_id}` },
                { key: 'job_company', header: 'Company', render: row => row.job_company || '—' },
                { key: 'score', header: 'Score', render: row => <span className="font-semibold text-purple-300">{row.score}%</span> },
                { key: 'status', header: 'Status', render: row => <StatusBadge status={row.status} /> },
              ]}
              emptyLabel={loading ? 'Loading matches…' : 'No matches'}
            />
          )}
        </div>

        <div className="card">
          <h2 className="font-display font-semibold text-white mb-4">Progress toward skill goals</h2>
          <ChartComponent
            type="line"
            xKey="date"
            yKey="score"
            color="#4ade80"
            data={history.map(item => ({ date: formatDate(item.created_at), score: item.score }))}
          />
        </div>
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <div className="card xl:col-span-2">
          <h2 className="font-display font-semibold text-white mb-4">Resume analysis insights</h2>
          {history.length === 0 ? (
            <p className="text-slate-500 text-sm">No analysis history yet. Start by scoring your resume.</p>
          ) : (
            history.map(item => (
              <div key={item.id} className="border-b border-indigo-500/10 py-3 last:border-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-slate-200 text-sm">{item.original_filename || 'Resume analysis'}</p>
                  <p className="text-xs text-slate-500">{formatDate(item.created_at)}</p>
                </div>
                <p className="text-slate-400 text-sm mt-1">{item.summary}</p>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <h2 className="font-display font-semibold text-white mb-3">AI coach suggestions</h2>
          <div className="space-y-3 text-sm text-slate-300">
            <p className="p-3 rounded-lg bg-white/5 border border-indigo-500/20"><Lightbulb size={14} className="inline mr-2 text-purple-300" />Practice one project from your top missing skill each week.</p>
            <p className="p-3 rounded-lg bg-white/5 border border-indigo-500/20"><Star size={14} className="inline mr-2 text-sky-300" />Target roles where your score is above 70% for faster callbacks.</p>
            <p className="p-3 rounded-lg bg-white/5 border border-indigo-500/20"><GraduationCap size={14} className="inline mr-2 text-emerald-300" />Track your skill completion and update your resume every two weeks.</p>
            <Link href="/dashboard/candidate/coach" className="btn-secondary w-full justify-center mt-3">Open AI Coach</Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

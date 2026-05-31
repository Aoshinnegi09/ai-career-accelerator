'use client'

import DashboardLayout from '@/components/dashboard/DashboardLayout'
import DataTable from '@/components/dashboard/DataTable'
import StatusBadge from '@/components/dashboard/StatusBadge'
import ChartComponent from '@/components/dashboard/ChartComponent'
import EmptyState from '@/components/common/EmptyState'
import { CalendarDays, MessageSquare } from 'lucide-react'
import { useCandidateDashboard } from '@/hooks/useDashboard'

export default function ApplicantDashboardPage() {
  const { data } = useCandidateDashboard()
  const applications = data?.matches || []

  const statusChart = [
    { status: 'pending', count: applications.filter(a => a.status === 'pending').length },
    { status: 'shortlisted', count: applications.filter(a => a.status === 'shortlisted').length },
    { status: 'rejected', count: applications.filter(a => a.status === 'rejected').length },
    {
      status: 'interview_scheduled',
      count: applications.filter(a => (a.recruiter_notes || '').toLowerCase().includes('interview')).length,
    },
  ]

  return (
    <DashboardLayout
      role={['candidate', 'applicant']}
      title="Applicant Dashboard"
      subtitle="Monitor application outcomes, feedback, and next-step recommendations"
      crumbs={[{ label: 'Dashboard' }, { label: 'Applicant' }]}
    >
      <div className="grid xl:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-display font-semibold text-white mb-4">Application status overview</h2>
          <ChartComponent type="bar" xKey="status" yKey="count" data={statusChart} color="#38bdf8" />
        </div>
        <div className="card">
          <h2 className="font-display font-semibold text-white mb-4">Interview schedule & feedback</h2>
          {applications.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No interviews yet"
              description="As applications progress, interview details and recruiter feedback will appear here."
            />
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 6).map(app => (
                <div key={app.id} className="p-3 rounded-lg border border-indigo-500/20 bg-white/5">
                  <div className="flex justify-between items-center gap-3">
                    <p className="text-sm text-slate-200">{app.job_title || `Job #${app.job_id}`}</p>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="text-xs text-slate-400 mt-2 flex items-start gap-2">
                    <MessageSquare size={12} className="mt-0.5" />
                    {app.recruiter_notes || 'No recruiter feedback yet. Keep your profile updated and continue applying.'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="font-display font-semibold text-white mb-4">Applications with match-score breakdown</h2>
        <DataTable
          rows={applications}
          columns={[
            { key: 'job_title', header: 'Job title', render: row => row.job_title || `Job #${row.job_id}` },
            { key: 'job_company', header: 'Company', render: row => row.job_company || '—' },
            { key: 'score', header: 'Match score', render: row => `${row.score}%` },
            {
              key: 'recommended_project',
              header: 'Recommended next step',
              render: row => row.recommended_project || 'Continue tailoring your resume for this role.',
            },
            { key: 'status', header: 'Status', render: row => <StatusBadge status={row.status} /> },
          ]}
          emptyLabel="No applications yet"
        />
      </div>
    </DashboardLayout>
  )
}

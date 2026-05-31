'use client'

import DashboardLayout from '@/components/dashboard/DashboardLayout'
import DataTable from '@/components/dashboard/DataTable'
import StatusBadge from '@/components/dashboard/StatusBadge'
import { useRecruiterDashboard } from '@/hooks/useDashboard'

export default function RecruiterMatchesDashboardPage() {
  const { data } = useRecruiterDashboard()

  return (
    <DashboardLayout role="recruiter" title="Recruiter Matches" subtitle="Review candidate matches and pipeline decisions" crumbs={[{ label: 'Dashboard', href: '/dashboard/recruiter' }, { label: 'Matches' }]}>
      <div className="card">
        <DataTable
          rows={data?.matches || []}
          columns={[
            { key: 'candidate_name', header: 'Candidate', render: row => row.candidate_name || `Candidate #${row.candidate_id}` },
            { key: 'job_title', header: 'Job', render: row => row.job_title || `Job #${row.job_id}` },
            { key: 'score', header: 'Score', render: row => `${row.score}%` },
            { key: 'status', header: 'Status', render: row => <StatusBadge status={row.status} /> },
          ]}
          emptyLabel="No matches yet"
        />
      </div>
    </DashboardLayout>
  )
}

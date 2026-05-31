'use client'

import DashboardLayout from '@/components/dashboard/DashboardLayout'
import DataTable from '@/components/dashboard/DataTable'
import StatusBadge from '@/components/dashboard/StatusBadge'
import { useCandidateDashboard } from '@/hooks/useDashboard'

export default function CandidateMatchesDashboardPage() {
  const { data } = useCandidateDashboard()

  return (
    <DashboardLayout role={['candidate', 'applicant']} title="Candidate Matches" subtitle="Track applications and match statuses" crumbs={[{ label: 'Dashboard', href: '/dashboard/candidate' }, { label: 'Matches' }]}>
      <div className="card">
        <DataTable
          rows={data?.matches || []}
          columns={[
            { key: 'job_title', header: 'Role', render: row => row.job_title || `Job #${row.job_id}` },
            { key: 'job_company', header: 'Company', render: row => row.job_company || '—' },
            { key: 'score', header: 'Match score', render: row => `${row.score}%` },
            { key: 'status', header: 'Status', render: row => <StatusBadge status={row.status} /> },
          ]}
          emptyLabel="No matches available"
        />
      </div>
    </DashboardLayout>
  )
}

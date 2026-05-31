'use client'

import DashboardLayout from '@/components/dashboard/DashboardLayout'
import DataTable from '@/components/dashboard/DataTable'
import StatusBadge from '@/components/dashboard/StatusBadge'
import { useRecruiterDashboard } from '@/hooks/useDashboard'
import { formatDate } from '@/utils/formatting'

export default function RecruiterJobsDashboardPage() {
  const { data } = useRecruiterDashboard()

  return (
    <DashboardLayout role="recruiter" title="Recruiter Jobs" subtitle="Manage all postings with status visibility" crumbs={[{ label: 'Dashboard', href: '/dashboard/recruiter' }, { label: 'Jobs' }]}>
      <div className="card">
        <DataTable
          rows={data?.jobs || []}
          columns={[
            { key: 'title', header: 'Title' },
            { key: 'company', header: 'Company' },
            { key: 'location', header: 'Location' },
            { key: 'status', header: 'Status', render: row => <StatusBadge status={row.status} /> },
            { key: 'created_at', header: 'Posted', render: row => formatDate(row.created_at) },
          ]}
          emptyLabel="No job postings found"
        />
      </div>
    </DashboardLayout>
  )
}

'use client'

import DashboardLayout from '@/components/dashboard/DashboardLayout'
import ChartComponent from '@/components/dashboard/ChartComponent'
import { useRecruiterDashboard } from '@/hooks/useDashboard'
import { truncateText } from '@/utils/formatting'

const MAX_CHART_LABEL_LENGTH = 14

export default function RecruiterAnalyticsDashboardPage() {
  const { data } = useRecruiterDashboard()
  const matches = data?.matches || []

  return (
    <DashboardLayout role="recruiter" title="Recruiter Analytics" subtitle="Pipeline and match analytics" crumbs={[{ label: 'Dashboard', href: '/dashboard/recruiter' }, { label: 'Analytics' }]}>
      <div className="grid xl:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-display text-white font-semibold mb-4">Pipeline split</h2>
          <ChartComponent
            type="bar"
            xKey="status"
            yKey="count"
            data={['pending', 'shortlisted', 'rejected'].map(status => ({
              status,
              count: matches.filter(match => match.status === status).length,
            }))}
          />
        </div>
        <div className="card">
          <h2 className="font-display text-white font-semibold mb-4">Job demand trend</h2>
          <ChartComponent
            type="line"
            xKey="job"
            yKey="value"
            color="#38bdf8"
            data={(data?.jobs || []).slice(0, 6).map(job => ({
              job: truncateText(job.title, MAX_CHART_LABEL_LENGTH),
              value: matches.filter(match => match.job_id === job.id).length,
            }))}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

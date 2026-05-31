'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Briefcase, UserSearch, ListChecks, TrendingUp, PlusCircle } from 'lucide-react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import StatCard from '@/components/dashboard/StatCard'
import DataTable, { Column } from '@/components/dashboard/DataTable'
import ChartComponent from '@/components/dashboard/ChartComponent'
import StatusBadge from '@/components/dashboard/StatusBadge'
import EmptyState from '@/components/common/EmptyState'
import { useRecruiterDashboard } from '@/hooks/useDashboard'
import { Match, JobPosting } from '@/lib/api'
import { truncateText } from '@/utils/formatting'

// Keep labels compact so line chart ticks remain readable on tablet widths.
const MAX_JOB_TITLE_LENGTH = 18

export default function RecruiterDashboardPage() {
  const { data, loading } = useRecruiterDashboard()
  const [search, setSearch] = useState('')

  const jobs = data?.jobs || []
  const matches = data?.matches || []

  const filteredJobs = useMemo(
    () => jobs.filter(j => `${j.title} ${j.company}`.toLowerCase().includes(search.toLowerCase())),
    [jobs, search],
  )

  const pipeline = {
    pending: matches.filter(m => m.status === 'pending').length,
    shortlisted: matches.filter(m => m.status === 'shortlisted').length,
    rejected: matches.filter(m => m.status === 'rejected').length,
  }

  const topJobs = jobs
    .slice(0, 5)
    .map(job => ({
      name: truncateText(job.title, MAX_JOB_TITLE_LENGTH),
      applications: matches.filter(match => match.job_id === job.id).length,
    }))

  const jobColumns: Column<JobPosting>[] = [
    { key: 'title', header: 'Role' },
    { key: 'company', header: 'Company' },
    { key: 'status', header: 'Status', render: row => <StatusBadge status={row.status} /> },
    { key: 'created_at', header: 'Created' },
    { key: 'id', header: 'Action', render: row => <Link href={`/recruiter/jobs/${row.id}`} className="text-purple-400">Review</Link> },
  ]

  const matchColumns: Column<Match>[] = [
    { key: 'candidate_name', header: 'Candidate', render: row => row.candidate_name || 'Candidate' },
    { key: 'job_title', header: 'Job', render: row => row.job_title || `Job #${row.job_id}` },
    { key: 'score', header: 'Match Score', render: row => `${row.score}%` },
    { key: 'status', header: 'Pipeline', render: row => <StatusBadge status={row.status} /> },
  ]

  return (
    <DashboardLayout
      role="recruiter"
      title="Recruiter Dashboard"
      subtitle="Track hiring pipeline, applications, and top job performance"
      crumbs={[{ label: 'Dashboard' }, { label: 'Recruiter' }]}
      action={
        <div className="flex gap-2">
          <Link href="/recruiter/jobs/new" className="btn-primary" style={{ width: 'auto', padding: '0.65rem 1rem' }}>
            <PlusCircle size={16} className="inline mr-1" /> Post new job
          </Link>
          <Link href="/recruiter/jobs" className="btn-secondary">Review applications</Link>
        </div>
      }
    >
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total jobs" value={jobs.length} icon={Briefcase} color="#a78bfa" />
        <StatCard title="Active candidates" value={new Set(matches.map(m => m.candidate_id)).size} icon={UserSearch} color="#38bdf8" />
        <StatCard title="Pending matches" value={pipeline.pending} icon={ListChecks} color="#fbbf24" />
        <StatCard title="Unread updates" value={data?.notifications || 0} icon={TrendingUp} color="#4ade80" />
      </div>

      <div className="card">
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <h2 className="font-display font-semibold text-white">Job postings management</h2>
          <input
            className="input-field max-w-xs"
            placeholder="Search jobs…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <DataTable columns={jobColumns} rows={filteredJobs} emptyLabel={loading ? 'Loading jobs…' : 'No job postings found'} />
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-display font-semibold text-white mb-4">Hiring pipeline</h2>
          <ChartComponent
            type="bar"
            xKey="stage"
            yKey="count"
            data={[
              { stage: 'Pending', count: pipeline.pending },
              { stage: 'Shortlisted', count: pipeline.shortlisted },
              { stage: 'Rejected', count: pipeline.rejected },
            ]}
          />
        </div>
        <div className="card">
          <h2 className="font-display font-semibold text-white mb-4">Top performing jobs</h2>
          <ChartComponent type="line" xKey="name" yKey="applications" data={topJobs} color="#38bdf8" />
        </div>
      </div>

      <div className="card">
        <h2 className="font-display font-semibold text-white mb-4">Recent matches/applications</h2>
        {matches.length === 0 ? (
          <EmptyState
            icon={UserSearch}
            title="No applications yet"
            description="Share your openings and run automatch to start seeing qualified candidates."
            actionLabel="Manage jobs"
            actionHref="/recruiter/jobs"
          />
        ) : (
          <DataTable columns={matchColumns} rows={matches.slice(0, 8)} />
        )}
      </div>
    </DashboardLayout>
  )
}

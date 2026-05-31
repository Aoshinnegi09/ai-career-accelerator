'use client'

import { useEffect, useState } from 'react'
import { analyticsApi, candidateApi, jobsApi, notificationsApi, skillsApi, Match, JobPosting, AnalysisSummary, CandidateProfile } from '@/lib/api'

interface CandidateDashboardData {
  profile: CandidateProfile | null
  history: AnalysisSummary[]
  matches: Match[]
  notifications: number
  skillsCompleted: number
}

interface RecruiterDashboardData {
  jobs: JobPosting[]
  matches: Match[]
  notifications: number
}

export function useCandidateDashboard() {
  const [data, setData] = useState<CandidateDashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      candidateApi.getProfile().then(r => r.data).catch(() => null),
      candidateApi.getHistory(1, 5).then(r => r.data.results).catch(() => []),
      jobsApi.myMatches(1, 8).then(r => r.data.results).catch(() => []),
      notificationsApi.unreadCount().then(r => r.data.unread_count).catch(() => 0),
      skillsApi.stats().then(r => r.data.completed).catch(() => 0),
      analyticsApi.candidate(90).catch(() => null),
    ]).then(([profile, history, matches, notifications, skillsCompleted]) => {
      setData({ profile, history, matches, notifications, skillsCompleted })
    }).finally(() => setLoading(false))
  }, [])

  return { data, loading }
}

export function useRecruiterDashboard() {
  const [data, setData] = useState<RecruiterDashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    jobsApi.mine(1, 12)
      .then(async response => {
        const jobs = response.data.results
        const candidates = await Promise.all(
          jobs.slice(0, 4).map(job => jobsApi.getCandidates(job.id, 1, 3).then(r => r.data.results).catch(() => [])),
        )
        const notifications = await notificationsApi.unreadCount().then(r => r.data.unread_count).catch(() => 0)
        setData({ jobs, matches: candidates.flat(), notifications })
      })
      .finally(() => setLoading(false))
  }, [])

  return { data, loading }
}

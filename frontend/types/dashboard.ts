export type DashboardRole = 'candidate' | 'recruiter' | 'applicant' | 'admin'

export type StatusTone =
  | 'pending'
  | 'shortlisted'
  | 'rejected'
  | 'reviewed'
  | 'active'
  | 'closed'
  | 'scheduled'

export interface StatItem {
  label: string
  value: number | string
  hint?: string
}

export interface PipelineItem {
  name: string
  value: number
}

export interface DashboardMenuItem {
  href: string
  label: string
}

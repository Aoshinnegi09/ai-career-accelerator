import { getRole } from '@/lib/auth'

export const ROLE_DASHBOARD: Record<string, string> = {
  recruiter: '/dashboard/recruiter',
  candidate: '/dashboard/candidate',
  applicant: '/dashboard/applicant',
  admin: '/admin',
}

export function getDefaultDashboard(role = getRole() || 'candidate'): string {
  return ROLE_DASHBOARD[role] || '/dashboard/candidate'
}

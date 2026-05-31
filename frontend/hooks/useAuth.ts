'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authApi, User } from '@/lib/api'
import { getRole, isLoggedIn } from '@/lib/auth'
import { getDefaultDashboard } from '@/utils/auth'
import { DashboardRole } from '@/types/dashboard'

export function useAuth(requiredRoles?: DashboardRole[]) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login')
      return
    }

    authApi
      .me()
      .then(({ data }) => {
        const role = (data.role || getRole()) as DashboardRole
        if (requiredRoles?.length && !requiredRoles.includes(role)) {
          router.replace(getDefaultDashboard(role))
          return
        }
        setUser(data)
      })
      .catch(() => {
        router.replace('/login')
      })
      .finally(() => setLoading(false))
  }, [requiredRoles, router])

  return { user, loading, role: (user?.role || getRole()) as DashboardRole }
}

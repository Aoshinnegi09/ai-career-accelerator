import { jwtDecode } from 'jwt-decode'

interface JWTPayload { 
  sub: string; 
  role: string; 
  type: string; 
  exp: number 
}
type AppRole = 'candidate' | 'recruiter' | 'admin'

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const REMEMBER_ME_KEY = 'remember_me'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const canUseStorage = () => typeof window !== 'undefined'

export const getToken = () => (canUseStorage() ? localStorage.getItem(ACCESS_TOKEN_KEY) : null)

export const getRefreshToken = () => (canUseStorage() ? localStorage.getItem(REFRESH_TOKEN_KEY) : null)

export const clearTokens = () => {
  if (!canUseStorage()) return
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(REMEMBER_ME_KEY)
}

const decodeToken = (token: string | null): JWTPayload | null => {
  if (!token) return null
  try {
    return jwtDecode<JWTPayload>(token)
  } catch {
    return null
  }
}

export const isTokenExpired = (token: string | null) => {
  const payload = decodeToken(token)
  if (!payload) return true
  return payload.exp * 1000 <= Date.now()
}

const normalizeRole = (role: string | null): AppRole | null => {
  if (!role) return null
  if (role === 'hr') return 'recruiter'
  if (role === 'candidate' || role === 'recruiter' || role === 'admin') return role
  return null
}

export const getRole = (): AppRole | null => {
  const payload = decodeToken(getToken())
  return normalizeRole(payload?.role ?? null)
}

export const isLoggedIn = () => { 
  return !!getToken() && !isTokenExpired(getToken())
}

export const ensureValidToken = async (): Promise<boolean> => {
  const token = getToken()
  if (token && !isTokenExpired(token)) return true

  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    clearTokens()
    return false
  }

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
    if (!response.ok) throw new Error('Token refresh failed')
    const data = await response.json()
    saveTokens(data.access_token, data.refresh_token)
    return true
  } catch {
    clearTokens()
    return false
  }
}

export const logout = () => {
  clearTokens()
  window.location.href = '/login' 
}

export const saveTokens = (access: string, refresh: string, rememberMe = true) => {
  if (!canUseStorage()) return
  localStorage.setItem(ACCESS_TOKEN_KEY, access)
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
  localStorage.setItem(REMEMBER_ME_KEY, rememberMe ? '1' : '0')
}
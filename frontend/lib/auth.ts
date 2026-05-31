import { jwtDecode } from 'jwt-decode'

interface JWTPayload {
  sub: string
  role: string
  type: string
  exp: number
}

export function buildCookie(name: string, value: string, maxAge: number): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${name}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`
}

export const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null)

export const getRefreshToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null

export const getRole = (): string | null => {
  try {
    const t = getToken()
    return t ? jwtDecode<JWTPayload>(t).role : null
  } catch {
    return null
  }
}

export const isLoggedIn = () => {
  try {
    const t = getToken()
    if (!t) return false
    const d = jwtDecode<JWTPayload>(t)
    return d.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export const clearTokens = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  document.cookie = 'access_token=; Path=/; Max-Age=0; SameSite=Lax'
  document.cookie = 'refresh_token=; Path=/; Max-Age=0; SameSite=Lax'
}

export const logout = () => {
  clearTokens()
  window.location.href = '/login'
}

export const saveTokens = (access: string, refresh: string) => {
  localStorage.setItem('access_token', access)
  localStorage.setItem('refresh_token', refresh)
  document.cookie = buildCookie('access_token', access, 60 * 60 * 24)
  document.cookie = buildCookie('refresh_token', refresh, 60 * 60 * 24 * 30)
}

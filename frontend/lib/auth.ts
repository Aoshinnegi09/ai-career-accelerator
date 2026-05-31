import { jwtDecode } from 'jwt-decode'

interface JWTPayload {
  sub: string
  role: string
  type: string
  exp: number
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
  document.cookie = 'access_token=; Path=/; Max-Age=0'
  document.cookie = 'refresh_token=; Path=/; Max-Age=0'
}

export const logout = () => {
  clearTokens()
  window.location.href = '/login'
}

export const saveTokens = (access: string, refresh: string) => {
  localStorage.setItem('access_token', access)
  localStorage.setItem('refresh_token', refresh)
  document.cookie = `access_token=${access}; Path=/; Max-Age=${60 * 60 * 24}`
  document.cookie = `refresh_token=${refresh}; Path=/; Max-Age=${60 * 60 * 24 * 30}`
}

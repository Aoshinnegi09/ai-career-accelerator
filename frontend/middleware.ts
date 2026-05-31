import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

function decodeRole(token: string | undefined): string | null {
  if (!token) return null
  try {
    const [, payload] = token.split('.')
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = JSON.parse(atob(normalized)) as { role?: string; exp?: number }
    if (!json.exp || json.exp * 1000 < Date.now()) return null
    return json.role || null
  } catch {
    return null
  }
}

function roleHome(role: string | null): string {
  if (role === 'recruiter') return '/dashboard/recruiter'
  if (role === 'applicant') return '/dashboard/applicant'
  if (role === 'admin') return '/admin'
  return '/dashboard/candidate'
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/dashboard')) return NextResponse.next()

  const token = request.cookies.get('access_token')?.value
  const role = decodeRole(token)

  if (!role) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname.startsWith('/dashboard/recruiter') && role !== 'recruiter') {
    return NextResponse.redirect(new URL(roleHome(role), request.url))
  }

  if (pathname.startsWith('/dashboard/candidate') && !['candidate', 'applicant'].includes(role)) {
    return NextResponse.redirect(new URL(roleHome(role), request.url))
  }

  if (pathname.startsWith('/dashboard/applicant') && !['candidate', 'applicant'].includes(role)) {
    return NextResponse.redirect(new URL(roleHome(role), request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}

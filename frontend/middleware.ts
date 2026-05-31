import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

function roleHome(role: string | null): string {
  if (role === 'recruiter') return '/dashboard/recruiter'
  if (role === 'applicant') return '/dashboard/applicant'
  if (role === 'admin') return '/admin'
  return '/dashboard/candidate'
}

async function resolveRole(token: string): Promise<string | null> {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: 'Bearer ' + token },
      cache: 'no-store',
    })
    if (!response.ok) return null
    const user = (await response.json()) as { role?: string }
    return user.role || null
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/dashboard')) return NextResponse.next()

  const token = request.cookies.get('access_token')?.value
  if (!token) return NextResponse.redirect(new URL('/login', request.url))

  const role = await resolveRole(token)
  if (!role) return NextResponse.redirect(new URL('/login', request.url))

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

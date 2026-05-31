'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'

import AuthShell from '@/components/ui/AuthShell'
import InputField from '@/components/auth/InputField'
import ErrorMessage from '@/components/auth/ErrorMessage'
import SuccessMessage from '@/components/auth/SuccessMessage'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { authApi, getErrorMessage } from '@/lib/api'
import { ensureValidToken, getRole, saveTokens } from '@/lib/auth'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [form, setForm] = useState({ email: '', password: '' })
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    ensureValidToken().then((authed) => {
      if (authed) {
        router.replace(getRole() === 'recruiter' ? '/recruiter/dashboard' : '/dashboard')
      }
    })
  }, [router])

  useEffect(() => {
    if (params.get('verified') === '1') {
      setSuccess('Email verified! Sign in to continue.')
    }
  }, [params])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!emailPattern.test(form.email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (!form.password.trim()) {
      setError('Password is required.')
      return
    }

    setLoading(true)
    try {
      const { data } = await authApi.login({ email: form.email.trim(), password: form.password })
      saveTokens(data.access_token, data.refresh_token, rememberMe)
      setForm({ email: '', password: '' })
      setSuccess('Login successful. Redirecting...')
      toast.success('Welcome back!')
      router.push(getRole() === 'recruiter' ? '/recruiter/dashboard' : '/dashboard')
    } catch (err: unknown) {
      const message = getErrorMessage(err)
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue to your dashboard.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <ErrorMessage message={error} />
        <SuccessMessage message={success} />

        <InputField
          label="Email"
          id="login-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={form.email}
          onChange={(email) => setForm((prev) => ({ ...prev, email }))}
          error={form.email && !emailPattern.test(form.email) ? 'Please enter a valid email address.' : undefined}
          required
        />

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="login-password" className="text-xs text-slate-400 uppercase tracking-wider">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs text-purple-400 hover:text-purple-300">
              Forgot password?
            </Link>
          </div>
          <InputField
            label=""
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
            value={form.password}
            onChange={(password) => setForm((prev) => ({ ...prev, password }))}
            required
            rightSlot={
              <button
                type="button"
                className="text-slate-400"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-slate-600 bg-slate-900"
          />
          Remember me
        </label>

        <button type="submit" disabled={loading} className="btn-primary mt-1 flex items-center justify-center gap-2">
          {loading ? (
            <>
              <LoadingSpinner />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-400">
        No account?{' '}
        <Link href="/signup" className="font-medium text-purple-400 hover:text-purple-300">
          Create one
        </Link>
      </p>
    </AuthShell>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Loading…</div>}>
      <LoginForm />
    </Suspense>
  )
}

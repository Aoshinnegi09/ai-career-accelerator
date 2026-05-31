'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

import AuthShell from '@/components/ui/AuthShell'
import InputField from '@/components/auth/InputField'
import ErrorMessage from '@/components/auth/ErrorMessage'
import SuccessMessage from '@/components/auth/SuccessMessage'
import PasswordStrengthIndicator from '@/components/auth/PasswordStrengthIndicator'
import RoleSelector from '@/components/auth/RoleSelector'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { authApi, getErrorMessage } from '@/lib/api'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const hasUpper = (v: string) => /[A-Z]/.test(v)
const hasDigit = (v: string) => /\d/.test(v)

function RegisterForm() {
  const router = useRouter()
  const params = useSearchParams()

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    role: 'candidate' as 'candidate' | 'recruiter',
  })
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (params.get('role') === 'recruiter') {
      setForm((prev) => ({ ...prev, role: 'recruiter' }))
    }
  }, [params])

  const validationErrors = useMemo(() => {
    const next: Record<string, string> = {}
    if (!form.full_name.trim()) next.full_name = 'Full name is required.'
    else if (form.full_name.trim().length < 2) next.full_name = 'Full name must be at least 2 characters.'

    if (!form.email.trim()) next.email = 'Email is required.'
    else if (!emailPattern.test(form.email)) next.email = 'Please enter a valid email address.'

    if (!form.password) next.password = 'Password is required.'
    else if (form.password.length < 8) next.password = 'Password must be at least 8 characters.'
    else if (!hasUpper(form.password)) next.password = 'Password must contain at least one uppercase letter.'
    else if (!hasDigit(form.password)) next.password = 'Password must contain at least one digit.'

    if (!form.confirmPassword) next.confirmPassword = 'Please confirm your password.'
    else if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match.'
    if (!termsAccepted) next.terms = 'Please accept the terms and conditions.'
    return next
  }, [form, termsAccepted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors[Object.keys(validationErrors)[0]])
      return
    }

    setLoading(true)
    try {
      const payload = {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      }
      const { data } = await authApi.register(payload)

      setSuccess(data.message || 'Account created successfully. Redirecting to login...')
      toast.success('Account created successfully')
      setForm({ email: '', password: '', confirmPassword: '', full_name: '', role: 'candidate' })
      setTermsAccepted(false)
      setTimeout(() => router.push('/login'), 1200)
    } catch (err: unknown) {
      const message = getErrorMessage(err)
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Create your account" subtitle="Join candidates and recruiters on the AI-powered talent platform.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <ErrorMessage message={error} />
        <SuccessMessage message={success} />

        <RoleSelector value={form.role} onChange={(role) => setForm((prev) => ({ ...prev, role }))} />

        <InputField
          label="Full name"
          id="register-fullname"
          placeholder="Your full name"
          value={form.full_name}
          autoComplete="name"
          onChange={(full_name) => setForm((prev) => ({ ...prev, full_name }))}
          error={validationErrors.full_name}
          required
        />

        <InputField
          label="Email"
          id="register-email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          autoComplete="email"
          onChange={(email) => setForm((prev) => ({ ...prev, email }))}
          error={validationErrors.email}
          required
        />

        <InputField
          label="Password"
          id="register-password"
          type="password"
          placeholder="Min 8 chars, 1 uppercase, 1 number"
          value={form.password}
          autoComplete="new-password"
          onChange={(password) => setForm((prev) => ({ ...prev, password }))}
          error={validationErrors.password}
          required
        />
        <PasswordStrengthIndicator password={form.password} />

        <InputField
          label="Confirm password"
          id="register-confirm-password"
          type="password"
          placeholder="Re-enter password"
          value={form.confirmPassword}
          autoComplete="new-password"
          onChange={(confirmPassword) => setForm((prev) => ({ ...prev, confirmPassword }))}
          error={validationErrors.confirmPassword}
          required
        />

        <label className="flex items-start gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-900"
          />
          <span>
            I agree to the terms and conditions.
            {validationErrors.terms ? <span className="block text-xs text-red-300">{validationErrors.terms}</span> : null}
          </span>
        </label>

        <button type="submit" disabled={loading} className="btn-primary mt-1 flex items-center justify-center gap-2">
          {loading ? (
            <>
              <LoadingSpinner />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-purple-400 hover:text-purple-300">
          Sign in
        </Link>
      </p>
    </AuthShell>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Loading…</div>}>
      <RegisterForm />
    </Suspense>
  )
}

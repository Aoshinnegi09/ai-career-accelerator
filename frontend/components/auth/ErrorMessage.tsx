'use client'

export default function ErrorMessage({ message }: { message?: string | null }) {
  if (!message) return null
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300"
    >
      {message}
    </div>
  )
}

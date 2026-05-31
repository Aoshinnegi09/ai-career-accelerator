'use client'

export default function SuccessMessage({ message }: { message?: string | null }) {
  if (!message) return null
  return (
    <div
      role="status"
      className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300"
    >
      {message}
    </div>
  )
}

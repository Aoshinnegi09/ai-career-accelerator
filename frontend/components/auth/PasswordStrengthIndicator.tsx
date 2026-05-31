'use client'

const requirements = [
  { key: 'length', label: '8+ characters', test: (v: string) => v.length >= 8 },
  { key: 'upper', label: '1 uppercase', test: (v: string) => /[A-Z]/.test(v) },
  { key: 'digit', label: '1 digit', test: (v: string) => /\d/.test(v) },
]

export default function PasswordStrengthIndicator({ password }: { password: string }) {
  const score = requirements.filter((r) => r.test(password)).length
  const color = score <= 1 ? '#ef4444' : score === 2 ? '#f59e0b' : '#10b981'
  const label = score <= 1 ? 'Weak' : score === 2 ? 'Medium' : 'Strong'

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">Password strength</span>
        <span style={{ color }} className="font-medium">{label}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full transition-all"
          style={{ width: `${(score / requirements.length) * 100}%`, background: color }}
        />
      </div>
      <ul className="grid gap-1 text-xs text-slate-400">
        {requirements.map((r) => {
          const ok = r.test(password)
          return (
            <li key={r.key} className={ok ? 'text-emerald-300' : 'text-slate-500'}>
              • {r.label}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

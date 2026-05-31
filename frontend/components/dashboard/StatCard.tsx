import { LucideIcon } from 'lucide-react'

interface Props {
  title: string
  value: number | string
  subtitle?: string
  icon: LucideIcon
  color?: string
}

export default function StatCard({ title, value, subtitle, icon: Icon, color = '#a78bfa' }: Props) {
  return (
    <div className="stat-card card-interactive">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon size={16} color={color} />
        </div>
        <span className="text-xs uppercase tracking-wider text-slate-400">{title}</span>
      </div>
      <p className="font-display text-2xl font-bold text-white">{value}</p>
      {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
    </div>
  )
}

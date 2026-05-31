import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface Props {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: Props) {
  return (
    <div className="card text-center py-14">
      <div className="empty-state-icon mx-auto mb-4"><Icon size={32} /></div>
      <p className="font-display font-semibold text-lg text-slate-200">{title}</p>
      <p className="text-slate-500 text-sm mt-2">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-secondary inline-flex mt-6 w-auto">
          {actionLabel}
        </Link>
      )}
    </div>
  )
}

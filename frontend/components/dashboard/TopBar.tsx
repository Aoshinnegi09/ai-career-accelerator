import Link from 'next/link'

interface Props {
  title: string
  subtitle?: string
  crumbs?: { label: string; href?: string }[]
  action?: React.ReactNode
}

export default function TopBar({ title, subtitle, crumbs = [], action }: Props) {
  return (
    <div className="mb-6">
      {crumbs.length > 0 && (
        <div className="text-xs text-slate-500 mb-2 flex gap-2 items-center flex-wrap">
          {crumbs.map((crumb, index) => (
            <span key={`${crumb.label}-${index}`} className="flex items-center gap-2">
              {crumb.href ? <Link href={crumb.href} className="hover:text-slate-300">{crumb.label}</Link> : <span>{crumb.label}</span>}
              {index < crumbs.length - 1 && <span>/</span>}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {action}
      </div>
    </div>
  )
}

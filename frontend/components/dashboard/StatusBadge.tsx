import { StatusTone } from '@/types/dashboard'
import { titleCase } from '@/utils/formatting'

export default function StatusBadge({ status }: { status: string | StatusTone }) {
  const normalized = status.toLowerCase().replace(/\s+/g, '_')
  const klass = `status-badge status-${normalized}`
  return <span className={klass}>{titleCase(normalized)}</span>
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value)
}

export function formatDate(value?: string): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString()
}

export function titleCase(value: string): string {
  return value
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

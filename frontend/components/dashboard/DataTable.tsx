import { ReactNode } from 'react'

export interface Column<T> {
  key: keyof T | string
  header: string
  render?: (row: T) => ReactNode
  className?: string
}

interface Props<T> {
  columns: Column<T>[]
  rows: T[]
  emptyLabel?: string
}

export default function DataTable<T extends { id?: string | number }>({ columns, rows, emptyLabel = 'No data' }: Props<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b border-indigo-500/20">
            {columns.map(col => (
              <th key={String(col.key)} className={`py-3 px-3 text-slate-400 font-medium ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-slate-500">{emptyLabel}</td>
            </tr>
          ) : (
            rows.map((row) => {
              const firstColumnKey = String(columns[0]?.key || 'row')
              const rowRecord = row as Record<string, unknown>
              const fallbackKey = `${String(rowRecord[firstColumnKey] ?? 'row')}-${String(rowRecord.id ?? '')}`
              const key = row.id ?? fallbackKey

              return (
                <tr key={String(key)} className="border-b border-indigo-500/10 last:border-0">
                  {columns.map(col => (
                    <td key={String(col.key)} className={`py-3 px-3 text-slate-200 ${col.className || ''}`}>
                      {col.render ? col.render(row) : String(row[col.key as keyof T] ?? '—')}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

'use client'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

interface Props {
  type: 'bar' | 'line'
  data: Record<string, string | number>[]
  xKey: string
  yKey: string
  color?: string
  height?: number
}

const TOOLTIP_STYLE = {
  background: '#0f0f1a',
  border: '1px solid rgba(99,102,241,0.3)',
  borderRadius: 10,
  color: '#e2e8f0',
}

export default function ChartComponent({ type, data, xKey, yKey, color = '#a78bfa', height = 260 }: Props) {
  if (!data.length) return <p className="text-slate-500 text-sm py-12 text-center">No chart data available</p>

  const chartProps = {
    data,
    margin: { top: 8, right: 20, left: 0, bottom: 8 },
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      {type === 'bar' ? (
        <BarChart {...chartProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
          <XAxis dataKey={xKey} tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Bar dataKey={yKey} fill={color} radius={[6, 6, 0, 0]} />
        </BarChart>
      ) : (
        <LineChart {...chartProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
          <XAxis dataKey={xKey} tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Line type="monotone" dataKey={yKey} stroke={color} strokeWidth={2.5} dot={{ fill: color, r: 4 }} />
        </LineChart>
      )}
    </ResponsiveContainer>
  )
}

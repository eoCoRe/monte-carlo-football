"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import type { SimulationResult } from "@/lib/monte-carlo"

interface HistogramChartProps {
  result: SimulationResult
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
}) => {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-2xl">
        <p className="text-slate-400 text-sm mb-2">Score ≈ {label}</p>
        {payload.filter(p => p.value > 0).map((p) => (
          <p key={p.name} className="text-sm font-semibold" style={{ color: p.color }}>
            {p.name}: {p.value} perfis
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function HistogramChart({ result }: HistogramChartProps) {
  const top4 = result.rankings.slice(0, 4)

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">
            Histograma de Scores
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Distribuição real dos perfis gerados — resultados do Monte Carlo
          </p>
        </div>
        <span className="text-xs text-slate-500 border border-slate-700 rounded-full px-2.5 py-1">
          Top 4 jogadores
        </span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={result.histogramData}
          margin={{ top: 4, right: 8, left: 0, bottom: 20 }}
          barCategoryGap="5%"
          barGap={1}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="label"
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            label={{ value: "Score", position: "insideBottom", offset: -12, fill: "#475569", fontSize: 13 }}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Legend
            formatter={(value) => {
              const p = top4.find(r => r.player.code === value)
              return <span style={{ color: "#94a3b8", fontSize: 13 }}>{p?.player.shortName ?? value}</span>
            }}
          />
          {top4.map((r) => (
            <Bar
              key={r.player.code}
              dataKey={r.player.code}
              fill={r.player.color}
              fillOpacity={0.75}
              radius={[3, 3, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

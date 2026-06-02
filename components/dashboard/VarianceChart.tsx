"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import type { SimulationResult } from "@/lib/monte-carlo"

interface VarianceChartProps {
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
        <p className="text-slate-400 text-xs mb-2">Score: {label}</p>
        {payload.map((p) => (
          <p key={p.name} className="text-xs font-medium" style={{ color: p.color }}>
            {p.name}: {(p.value * 1000).toFixed(2)}‰
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function VarianceChart({ result }: VarianceChartProps) {
  const top3 = result.rankings.slice(0, 3)

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">
          Curva de Variância Estocástica
        </h3>
        <span className="text-xs text-slate-500">Distribuição gaussiana — Top 3</span>
      </div>

      <ResponsiveContainer width="100%" height={360}>
        <AreaChart data={result.distributionData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            {top3.map((r) => (
              <linearGradient
                key={r.player.code}
                id={`grad-${r.player.code}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={r.player.color} stopOpacity={0.6} />
                <stop offset="100%" stopColor={r.player.color} stopOpacity={0.05} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="score"
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v.toFixed(0)}
            label={{ value: "Score", position: "insideBottom", offset: -2, fill: "#475569", fontSize: 11 }}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => {
              const entry = top3.find((r) => r.player.code === value)
              return (
                <span style={{ color: "#94a3b8", fontSize: 12 }}>
                  {entry?.player.shortName ?? value}
                </span>
              )
            }}
          />
          {top3.map((r, i) => (
            <Area
              key={r.player.code}
              type="monotone"
              dataKey={r.player.code}
              stroke={r.player.color}
              strokeWidth={i === 0 ? 2.5 : 1.5}
              fill={`url(#grad-${r.player.code})`}
              fillOpacity={0.4}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

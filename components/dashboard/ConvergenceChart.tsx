"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import type { SimulationResult } from "@/lib/monte-carlo"

interface ConvergenceChartProps {
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
    const sorted = [...payload].sort((a, b) => b.value - a.value)
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-2xl min-w-[180px]">
        <p className="text-slate-400 text-sm mb-2 font-semibold">
          Iteração {Number(label).toLocaleString("pt-BR")}
        </p>
        {sorted.slice(0, 5).map((p) => (
          <p key={p.name} className="text-sm" style={{ color: p.color }}>
            {p.name}: <span className="font-bold">{p.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function ConvergenceChart({ result }: ConvergenceChartProps) {
  const top5 = result.rankings.slice(0, 5)

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">
          Convergência Monte Carlo
        </h3>
        <p className="text-[10px] text-slate-500 mt-0.5">
          Acúmulo de perfis qualificados por iteração — prova que a simulação estabiliza
        </p>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={result.convergenceData}
          margin={{ top: 4, right: 8, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="iteration"
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v / 1000}k`}
            label={{ value: "Iterações", position: "insideBottom", offset: -12, fill: "#475569", fontSize: 13 }}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => {
              const p = top5.find(r => r.player.code === value)
              return <span style={{ color: "#94a3b8", fontSize: 13 }}>{p?.player.shortName ?? value}</span>
            }}
          />
          {top5.map((r, i) => (
            <Line
              key={r.player.code}
              type="monotone"
              dataKey={r.player.code}
              stroke={r.player.color}
              strokeWidth={i === 0 ? 3.5 : 2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

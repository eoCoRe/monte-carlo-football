"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts"
import type { SimulationResult, Weights } from "@/lib/monte-carlo"
import { ATTRIBUTE_LABELS_SHORT, GLOBAL_AVERAGES } from "@/lib/monte-carlo"

interface SensitivityChartProps {
  result: SimulationResult
  weights: Weights
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: { label: string; impact: number; playerAvg: number; globalAvg: number; weight: number; delta: number } }[]
}) => {
  if (active && payload?.length) {
    const d = payload[0].payload
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-2xl max-w-[220px]">
        <p className="text-white font-bold text-sm mb-2">{d.label}</p>
        <p className="text-sm text-slate-300">
          Score do jogador: <span className="text-amber-400 font-bold">{d.playerAvg.toFixed(1)}</span>
        </p>
        <p className="text-sm text-slate-300">
          Média global: <span className="text-slate-400">{d.globalAvg.toFixed(1)}</span>
        </p>
        <p className="text-sm text-slate-300">
          Diferença: <span className={d.delta >= 0 ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
            {d.delta >= 0 ? "+" : ""}{d.delta.toFixed(1)}
          </span>
        </p>
        <p className="text-sm text-slate-300 mt-1">
          Peso na fórmula: <span className="text-amber-400 font-bold">{d.weight}%</span>
        </p>
      </div>
    )
  }
  return null
}

export function SensitivityChart({ result, weights }: SensitivityChartProps) {
  const winner = result.rankings[0]
  if (!winner || winner.count === 0) return null

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0) || 1

  const data = (Object.keys(ATTRIBUTE_LABELS_SHORT) as (keyof Weights)[]).map((key) => {
    const playerAvg = winner.avgAttributes[key]
    const globalAvg = GLOBAL_AVERAGES[key]
    const delta = playerAvg - globalAvg
    const weight = weights[key]
    const impact = (weight * delta) / totalWeight
    return {
      label: ATTRIBUTE_LABELS_SHORT[key],
      key,
      impact: Math.round(impact * 100) / 100,
      delta: Math.round(delta * 10) / 10,
      playerAvg: Math.round(playerAvg * 10) / 10,
      globalAvg: Math.round(globalAvg * 10) / 10,
      weight,
    }
  }).sort((a, b) => b.impact - a.impact)

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">
          Análise de Sensibilidade
        </h3>
        <p className="text-[10px] text-slate-500 mt-0.5">
          Contribuição de cada critério para a vitória de{" "}
          <span className="text-amber-400">{winner.player.shortName}</span>
          {" "}— impacto = peso × (score − média global)
        </p>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 60, left: 8, bottom: 4 }}
          barSize={28}
        >
          <CartesianGrid horizontal={false} stroke="#1e293b" strokeDasharray="3 3" />
          <XAxis
            type="number"
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v.toFixed(1)}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={130}
            tick={{ fill: "#cbd5e1", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <ReferenceLine x={0} stroke="#475569" strokeDasharray="3 3" />
          <Bar dataKey="impact" radius={[0, 6, 6, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.impact >= 0 ? "#22C55E" : "#EF4444"}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

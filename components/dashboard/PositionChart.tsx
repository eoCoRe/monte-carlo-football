"use client"

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList,
} from "recharts"
import type { SimulationResult } from "@/lib/monte-carlo"

interface Props {
  result: SimulationResult
}

const POSITION_LABEL: Record<string, string> = {
  ST:  "Atacante (ST)",
  WF:  "Ponta (WF)",
  CAM: "Meia-Atac. (CAM)",
  CM:  "Meia Central (CM)",
  DM:  "Volante (DM)",
  CB:  "Zagueiro (CB)",
  FB:  "Lateral (FB)",
  GK:  "Goleiro (GK)",
}

const POSITION_COLOR: Record<string, string> = {
  ST:  "#EF4444",
  WF:  "#F97316",
  CAM: "#FBBF24",
  CM:  "#22C55E",
  DM:  "#06B6D4",
  CB:  "#3B82F6",
  FB:  "#8B5CF6",
  GK:  "#EC4899",
}

const CustomTooltip = ({
  active, payload,
}: {
  active?: boolean
  payload?: { payload: { label: string; wins: number; pct: number; topPlayers: string } }[]
}) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-2xl max-w-56">
      <p className="text-white font-bold text-sm mb-1">{d.label}</p>
      <p className="font-semibold text-sm" style={{ color: "#FBBF24" }}>
        {d.wins.toLocaleString()} vitórias — {d.pct}%
      </p>
      {d.topPlayers && (
        <p className="text-slate-400 text-[11px] mt-1.5 leading-relaxed">{d.topPlayers}</p>
      )}
    </div>
  )
}

export function PositionChart({ result }: Props) {
  const total = result.rankings.reduce((s, r) => s + r.count, 0)

  const grouped: Record<string, { wins: number; players: { name: string; wins: number }[] }> = {}

  result.rankings.forEach(({ player, count }) => {
    const pos = player.position
    if (!grouped[pos]) grouped[pos] = { wins: 0, players: [] }
    grouped[pos].wins += count
    grouped[pos].players.push({ name: player.shortName, wins: count })
  })

  const data = Object.entries(grouped)
    .map(([pos, { wins, players }]) => {
      const sorted = [...players].sort((a, b) => b.wins - a.wins)
      const topPlayers = sorted
        .filter(p => p.wins > 0)
        .slice(0, 4)
        .map(p => `${p.name} (${p.wins})`)
        .join(" · ")
      return {
        pos,
        label: POSITION_LABEL[pos] ?? pos,
        wins,
        pct: Math.round((wins / total) * 1000) / 10,
        topPlayers,
      }
    })
    .sort((a, b) => b.wins - a.wins)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <p className="text-xs font-bold text-slate-200 uppercase tracking-widest">
          Vitórias por Posição
        </p>
        <p className="text-[10px] text-slate-500">
          Total de vitórias acumuladas por posição nas 10.000 simulações
        </p>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 56, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: "#64748b", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fill: "#cbd5e1", fontSize: 10, fontWeight: 500 }}
            width={108}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="wins" radius={[0, 6, 6, 0]} maxBarSize={22}>
            {data.map(entry => (
              <Cell
                key={entry.pos}
                fill={POSITION_COLOR[entry.pos] ?? "#94a3b8"}
                fillOpacity={0.85}
              />
            ))}
            <LabelList
              dataKey="pct"
              position="right"
              formatter={(v: number) => `${v}%`}
              style={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

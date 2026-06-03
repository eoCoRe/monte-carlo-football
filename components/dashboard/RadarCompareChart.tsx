"use client"

import { useState } from "react"
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Legend, Tooltip,
} from "recharts"
import { flagUrl, type SimulationResult } from "@/lib/monte-carlo"

interface Props {
  result: SimulationResult
}

const ATTRS = [
  { key: "gols" as const,                    label: "Gols" },
  { key: "assistencias" as const,            label: "Assists" },
  { key: "titulosIndividuais" as const,      label: "T. Individuais" },
  { key: "ligaNacional" as const,            label: "Liga Nacional" },
  { key: "copaNacional" as const,            label: "Copa Nacional" },
  { key: "copaContinentalClubes" as const,   label: "Copa Cont." },
  { key: "mundialClubes" as const,           label: "Mundial" },
  { key: "copaContinentalSelecao" as const,  label: "Copa Sel." },
  { key: "copaMundo" as const,               label: "Copa do Mundo" },
]

export function RadarCompareChart({ result }: Props) {
  const [p1Code, setP1Code] = useState(result.rankings[0].player.code)
  const [p2Code, setP2Code] = useState(result.rankings[1].player.code)

  const r1 = result.rankings.find(r => r.player.code === p1Code)!
  const r2 = result.rankings.find(r => r.player.code === p2Code)!

  const data = ATTRS.map(({ key, label }) => ({
    attribute: label,
    [r1.player.shortName]: Math.round(r1.player.baseAttributes[key]),
    [r2.player.shortName]: Math.round(r2.player.baseAttributes[key]),
  }))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-bold text-slate-200 uppercase tracking-widest">
          Comparação de Atributos
        </p>
        <p className="text-[10px] text-slate-500">
          Scores base reais de cada jogador nos 9 critérios
        </p>
      </div>

      {/* Player selectors */}
      <div className="grid grid-cols-2 gap-3">
        <PlayerSelector
          label="Jogador 1"
          rankings={result.rankings}
          value={p1Code}
          onChange={setP1Code}
          exclude={p2Code}
          color={r1.player.color}
          player={r1.player}
        />
        <PlayerSelector
          label="Jogador 2"
          rankings={result.rankings}
          value={p2Code}
          onChange={setP2Code}
          exclude={p1Code}
          color={r2.player.color}
          player={r2.player}
        />
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="#1e293b" />
          <PolarAngleAxis
            dataKey="attribute"
            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "#475569", fontSize: 9 }}
            tickCount={4}
            axisLine={false}
          />
          <Radar
            name={r1.player.shortName}
            dataKey={r1.player.shortName}
            stroke={r1.player.color}
            fill={r1.player.color}
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Radar
            name={r2.player.shortName}
            dataKey={r2.player.shortName}
            stroke={r2.player.color}
            fill={r2.player.color}
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: "#e2e8f0", fontSize: 11 }}>{value}</span>
            )}
          />
          <Tooltip
            contentStyle={{
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: 8,
              fontSize: 11,
            }}
            labelStyle={{ color: "#f1f5f9", fontWeight: 700, marginBottom: 4 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

function PlayerSelector({
  label, rankings, value, onChange, exclude, color, player,
}: {
  label: string
  rankings: SimulationResult["rankings"]
  value: string
  onChange: (code: string) => void
  exclude: string
  color: string
  player: SimulationResult["rankings"][number]["player"]
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{label}</p>
      <div
        className="flex items-center gap-2 rounded-lg border bg-slate-800/60 px-2.5 py-2"
        style={{ borderColor: `${color}60` }}
      >
        <img
          src={flagUrl(player.countryCode)}
          alt={player.country}
          width={20}
          height={14}
          className="rounded-sm object-cover shrink-0"
          style={{ width: 20, height: 14 }}
        />
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 appearance-none bg-transparent text-xs font-semibold text-slate-200 cursor-pointer focus:outline-none"
        >
          {rankings
            .filter(r => r.player.code !== exclude)
            .map(r => (
              <option
                key={r.player.code}
                value={r.player.code}
                style={{ background: "#1e293b" }}
              >
                {r.player.name} — {r.player.country}
              </option>
            ))}
        </select>
      </div>
    </div>
  )
}

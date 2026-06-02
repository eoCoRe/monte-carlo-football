"use client"

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LabelList,
} from "recharts"
import type { SimulationResult } from "@/lib/monte-carlo"
import { flagUrl } from "@/lib/monte-carlo"

interface RankingChartProps {
  result: SimulationResult
  onPlayerClick: (code: string) => void
}

const CustomTooltip = ({
  active, payload,
}: {
  active?: boolean
  payload?: { payload: { name: string; country: string; countryCode: string; count: number; avgScore: number } }[]
}) => {
  if (active && payload?.length) {
    const d = payload[0].payload
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-2xl">
        <div className="flex items-center gap-2 mb-1">
          <img src={flagUrl(d.countryCode)} alt={d.country} width={22} height={16}
            className="rounded-sm object-cover" style={{ width: 22, height: 16 }} />
          <p className="text-white font-bold text-sm">{d.name}</p>
        </div>
        <p className="text-slate-400 text-xs">{d.country}</p>
        <p className="text-amber-400 text-xs mt-1">{d.count} perfis qualificados</p>
        <p className="text-slate-400 text-xs">Score médio: {d.avgScore.toFixed(1)}</p>
      </div>
    )
  }
  return null
}

const CustomYAxisTick = ({
  x, y, payload,
}: {
  x?: number; y?: number; payload?: { value: string }
}) => {
  if (!payload || x === undefined || y === undefined) return null
  const sep = payload.value.indexOf("|")
  const countryCode = sep >= 0 ? payload.value.slice(0, sep) : ""
  const name = sep >= 0 ? payload.value.slice(sep + 1) : payload.value
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={-34} y={0} dy={4} textAnchor="end" fill="#cbd5e1" fontSize={10} fontWeight={600}>
        {name}
      </text>
      {countryCode && (
        <image
          href={flagUrl(countryCode)}
          x={-34 - name.length * 5.8 - 28}
          y={-8}
          width={22}
          height={16}
          preserveAspectRatio="xMidYMid meet"
        />
      )}
    </g>
  )
}

export function RankingChart({ result, onPlayerClick }: RankingChartProps) {
  const BAR_SIZE = 20
  const ROW_H   = BAR_SIZE + 10
  const chartH  = result.rankings.length * ROW_H + 20

  const data = result.rankings.map((r, i) => ({
    name:        r.player.name,
    shortName:   r.player.shortName,
    code:        r.player.code,
    country:     r.player.country,
    countryCode: r.player.countryCode,
    yLabel:      `${r.player.countryCode}|${r.player.shortName}`,
    count:       r.count,
    avgScore:    r.avgScore,
    color:       i === 0 ? "#FBBF24" : r.player.color,
    isFirst:     i === 0,
  }))

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">
            Ranking Completo — Todos os Jogadores
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {result.rankings.length} jogadores · clique para ver o Raio-X
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs bg-amber-400/10 border border-amber-400/30
          text-amber-400 px-2.5 py-1 rounded-full animate-pulse">
          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
          clique para detalhar
        </span>
      </div>

      {/* Scrollable chart container */}
      <div className="overflow-y-auto" style={{ maxHeight: 520 }}>
        <BarChart
          width={620}
          height={chartH}
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 56, left: 150, bottom: 4 }}
          barSize={BAR_SIZE}
        >
          <defs>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FDE68A" />
            </linearGradient>
          </defs>
          <CartesianGrid horizontal={false} stroke="#1e293b" strokeDasharray="3 3" />
          <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10 }}
            axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="yLabel" width={150}
            tick={<CustomYAxisTick />} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Bar dataKey="count" radius={[0, 6, 6, 0]} cursor="pointer"
            onClick={(d) => onPlayerClick(d.code)}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`}
                fill={entry.isFirst ? "url(#goldGrad)" : entry.color}
                fillOpacity={entry.isFirst ? 1 : 0.75} />
            ))}
            <LabelList dataKey="count" position="right"
              style={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }} />
          </Bar>
        </BarChart>
      </div>
    </div>
  )
}

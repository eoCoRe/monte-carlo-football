"use client"

import { useRef, useEffect, useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell, LabelList,
} from "recharts"
import type { SimulationResult } from "@/lib/monte-carlo"
import { flagUrl } from "@/lib/monte-carlo"

interface RankingChartProps {
  result: SimulationResult
  onPlayerClick: (code: string) => void
  limit?: number
}

const MEDAL_COLORS = [
  { id: "gold",   stops: ["#F59E0B", "#FDE68A"] },
  { id: "silver", stops: ["#94a3b8", "#e2e8f0"] },
  { id: "bronze", stops: ["#cd7f32", "#e8b87c"] },
]

const RANK_LABELS = ["🥇", "🥈", "🥉"]

const CustomTooltip = ({
  active, payload,
}: {
  active?: boolean
  payload?: { payload: { name: string; country: string; countryCode: string; count: number; avgScore: number; pct: number } }[]
}) => {
  if (active && payload?.length) {
    const d = payload[0].payload
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-2xl">
        <div className="flex items-center gap-2 mb-1">
          <img src={flagUrl(d.countryCode)} alt={d.country} width={26} height={19}
            className="rounded-sm object-cover" style={{ width: 26, height: 19 }} />
          <p className="text-white font-bold text-base">{d.name}</p>
        </div>
        <p className="text-slate-400 text-sm">{d.country}</p>
        <p className="text-amber-400 font-semibold text-sm mt-1">
          {d.count.toLocaleString()} vitórias · {d.pct}%
        </p>
        <p className="text-slate-400 text-sm">Score médio: {d.avgScore.toFixed(1)}</p>
      </div>
    )
  }
  return null
}

const CustomYAxisTick = ({
  x, y, payload, onPlayerClick, yAxisWidth,
}: {
  x?: number; y?: number; payload?: { value: string }
  onPlayerClick?: (code: string) => void
  yAxisWidth?: number
}) => {
  if (!payload || x === undefined || y === undefined) return null
  const w = yAxisWidth ?? 210
  const parts = payload.value.split("|")
  const rank = parseInt(parts[0] ?? "0", 10)
  const countryCode = parts[1] ?? ""
  const name = parts[2] ?? payload.value
  const code = parts[3] ?? ""
  const medal = rank <= 3 ? RANK_LABELS[rank - 1] : null
  const rankLabel = medal ? medal : `#${rank}`
  return (
    <g
      transform={`translate(${x},${y})`}
      onClick={() => code && onPlayerClick?.(code)}
      style={{ cursor: onPlayerClick ? "pointer" : "default" }}
    >
      <rect x={-w} y={-16} width={w} height={32} fill="transparent" />
      <text x={-w + 4} y={0} dy={5} textAnchor="start"
        fill={rank === 1 ? "#FBBF24" : rank === 2 ? "#94a3b8" : rank === 3 ? "#cd7f32" : "#475569"}
        fontSize={rank <= 3 ? 18 : 13} fontWeight={700}>
        {rankLabel}
      </text>
      {countryCode && (
        <image
          href={flagUrl(countryCode)}
          x={rank <= 3 ? -w + 46 : -w + 38}
          y={-11}
          width={28}
          height={20}
          preserveAspectRatio="xMidYMid meet"
        />
      )}
      <text x={-w + 82} y={0} dy={5} textAnchor="start"
        fill={rank === 1 ? "#fde68a" : rank <= 3 ? "#f1f5f9" : "#cbd5e1"}
        fontSize={13} fontWeight={rank <= 3 ? 700 : 500}>
        {name}
      </text>
    </g>
  )
}

export function RankingChart({ result, onPlayerClick, limit }: RankingChartProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [chartWidth, setChartWidth] = useState(700)

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width
      if (w > 0) setChartWidth(w)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const rankings = limit ? result.rankings.slice(0, limit) : result.rankings
  const total = result.rankings.reduce((s, r) => s + r.count, 0) || 1
  const BAR_SIZE = 30
  const ROW_H   = BAR_SIZE + 18
  const chartH  = rankings.length * ROW_H + 24

  // Y-axis width scales with available space (min 180, max 260)
  const Y_WIDTH = Math.min(260, Math.max(180, Math.round(chartWidth * 0.16)))
  const R_MARGIN = Math.round(chartWidth * 0.07)

  const data = rankings.map((r, i) => ({
    name:        r.player.name,
    shortName:   r.player.shortName,
    code:        r.player.code,
    country:     r.player.country,
    countryCode: r.player.countryCode,
    yLabel:      `${i + 1}|${r.player.countryCode}|${r.player.shortName}|${r.player.code}`,
    count:       r.count,
    avgScore:    r.avgScore,
    pct:         Math.round((r.count / total) * 1000) / 10,
    color:       r.player.color,
    rank:        i + 1,
  }))

  const gradientId = (rank: number) =>
    rank === 1 ? "url(#goldGrad)" : rank === 2 ? "url(#silverGrad)" : rank === 3 ? "url(#bronzeGrad)" : undefined

  return (
    <div ref={wrapperRef} className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-base font-bold text-white uppercase tracking-widest">
            Ranking Completo — Todos os Jogadores
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {limit ? `Top ${limit} de ${result.rankings.length}` : `${result.rankings.length} jogadores`} · clique para ver o Raio-X
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-sm bg-amber-400/10 border border-amber-400/30
          text-amber-400 px-3 py-1.5 rounded-full animate-pulse">
          <span className="w-2 h-2 bg-amber-400 rounded-full" />
          clique para detalhar
        </span>
      </div>

      <div style={{ width: "100%", height: chartH }}>
        <BarChart
          width={chartWidth}
          height={chartH}
          data={data}
          layout="vertical"
          margin={{ top: 6, right: R_MARGIN, left: 8, bottom: 6 }}
          barSize={BAR_SIZE}
        >
          <defs>
            {MEDAL_COLORS.map(({ id, stops }) => (
              <linearGradient key={id} id={`${id}Grad`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={stops[0]} />
                <stop offset="100%" stopColor={stops[1]} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid horizontal={false} stroke="#1e293b" strokeDasharray="3 3" />
          <XAxis type="number" tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="yLabel" width={Y_WIDTH}
            tick={(props: Parameters<typeof CustomYAxisTick>[0]) =>
              <CustomYAxisTick {...props} onPlayerClick={onPlayerClick} yAxisWidth={Y_WIDTH} />}
            axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Bar dataKey="count" radius={[0, 8, 8, 0]} cursor="pointer"
            onClick={(d) => onPlayerClick(d.code)}>
            {data.map((entry) => (
              <Cell
                key={`cell-${entry.code}`}
                fill={gradientId(entry.rank) ?? entry.color}
                fillOpacity={entry.rank <= 3 ? 1 : 0.75}
              />
            ))}
            <LabelList
              dataKey="pct"
              position="right"
              formatter={(v: number) => `${v}%`}
              style={{ fill: "#94a3b8", fontSize: 13, fontWeight: 700 }}
            />
          </Bar>
        </BarChart>
      </div>
    </div>
  )
}

"use client"

import { motion } from "framer-motion"
import type { SimulationResult } from "@/lib/monte-carlo"
import { flagUrl } from "@/lib/monte-carlo"

interface FullRankingTableProps {
  result: SimulationResult
}

const MEDAL: Record<number, { emoji: string; color: string }> = {
  1: { emoji: "🥇", color: "#FBBF24" },
  2: { emoji: "🥈", color: "#C0C0C0" },
  3: { emoji: "🥉", color: "#CD7F32" },
}

export function FullRankingTable({ result }: FullRankingTableProps) {
  const total = result.rankings.reduce((s, r) => s + r.count, 0)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">
            Ranking Completo — Todos os Jogadores
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {result.rankings.length} jogadores · ordenados por perfis qualificados na simulação
          </p>
        </div>
        <span className="text-[10px] text-slate-600 border border-slate-700 rounded-full px-2 py-0.5">
          {total.toLocaleString("pt-BR")} perfis totais qualificados
        </span>
      </div>

      {/* Header */}
      <div className="grid text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 pb-1 border-b border-slate-800"
        style={{ gridTemplateColumns: "2rem 2rem 14rem 1fr 5rem 5rem 5rem" }}>
        <span>#</span>
        <span></span>
        <span>Jogador</span>
        <span>País</span>
        <span className="text-right">Perfis</span>
        <span className="text-right">%</span>
        <span className="text-right">Score</span>
      </div>

      {/* Scrollable rows */}
      <div className="overflow-y-auto" style={{ maxHeight: 480 }}>
        {result.rankings.map((r, i) => {
          const rank = i + 1
          const medal = MEDAL[rank]
          const pct = total > 0 ? ((r.count / total) * 100) : 0
          const barWidth = Math.max(0, Math.min(100, pct * 8))

          return (
            <motion.div
              key={r.player.code}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.012, 0.5), duration: 0.25 }}
              className={`grid items-center px-3 py-2 rounded-lg mb-0.5 transition-colors hover:bg-slate-800/40 ${
                rank <= 3 ? "bg-slate-800/30" : ""
              }`}
              style={{ gridTemplateColumns: "2rem 2rem 14rem 1fr 5rem 5rem 5rem" }}
            >
              {/* Rank number */}
              <span className={`text-xs font-black tabular-nums ${
                medal ? "" : "text-slate-500"
              }`} style={{ color: medal?.color }}>
                {medal ? medal.emoji : rank}
              </span>

              {/* Flag */}
              <img
                src={flagUrl(r.player.countryCode)}
                alt={r.player.country}
                width={24}
                height={17}
                className="rounded-sm object-cover"
                style={{ width: 24, height: 17 }}
              />

              {/* Name + bar */}
              <div className="flex flex-col gap-0.5 pr-2">
                <span className={`text-xs font-bold leading-tight truncate ${
                  rank <= 3 ? "text-white" : "text-slate-300"
                }`}>
                  {r.player.name}
                </span>
                <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: rank === 1 ? "#FBBF24" : r.player.color,
                      opacity: rank <= 10 ? 0.9 : 0.4,
                    }}
                  />
                </div>
              </div>

              {/* Country */}
              <span className="text-[10px] text-slate-500 truncate pr-2">{r.player.country}</span>

              {/* Count */}
              <span className={`text-xs font-bold tabular-nums text-right ${
                rank <= 3 ? "text-amber-400" : "text-slate-300"
              }`}>
                {r.count.toLocaleString("pt-BR")}
              </span>

              {/* % */}
              <span className="text-[10px] text-slate-500 tabular-nums text-right">
                {pct.toFixed(1)}%
              </span>

              {/* Avg score */}
              <span className="text-[10px] text-slate-400 tabular-nums text-right">
                {r.avgScore > 0 ? r.avgScore.toFixed(1) : "—"}
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

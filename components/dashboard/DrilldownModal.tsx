"use client"

import { useState } from "react"
import { X, TrendingUp, TrendingDown, Trophy, BarChart3, Radar as RadarIcon, Sparkles } from "lucide-react"
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"
import { motion, AnimatePresence } from "framer-motion"
import type { SimulationResult, Weights } from "@/lib/monte-carlo"
import { ATTRIBUTE_LABELS, ATTRIBUTE_LABELS_SHORT, GLOBAL_AVERAGES, flagUrl } from "@/lib/monte-carlo"

interface DrilldownModalProps {
  playerCode: string | null
  result: SimulationResult
  weights: Weights
  onClose: () => void
}

type Tab = "ganhou" | "criterios" | "radar" | "cenario"

// ─── helpers ────────────────────────────────────────────────────────────────

function computeAnalysis(
  entry: SimulationResult["rankings"][number],
  weights: Weights,
  rankings: SimulationResult["rankings"]
) {
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0) || 1

  const criteria = (Object.keys(ATTRIBUTE_LABELS) as (keyof Weights)[]).map((key) => {
    const playerAvg = entry.avgAttributes[key]
    const globalAvg = GLOBAL_AVERAGES[key]
    const delta = playerAvg - globalAvg
    const weight = weights[key]
    const impact = (weight * delta) / totalWeight
    const rankAmongAll = [...rankings]
      .sort((a, b) => b.avgAttributes[key] - a.avgAttributes[key])
      .findIndex((r) => r.player.code === entry.player.code) + 1
    const best = Math.max(...rankings.map((r) => r.avgAttributes[key]))

    return {
      key,
      label: ATTRIBUTE_LABELS[key],
      shortLabel: ATTRIBUTE_LABELS_SHORT[key],
      playerAvg: Math.round(playerAvg * 10) / 10,
      globalAvg: Math.round(globalAvg * 10) / 10,
      delta: Math.round(delta * 10) / 10,
      weight,
      impact: Math.round(impact * 100) / 100,
      rank: rankAmongAll,
      best: Math.round(best * 10) / 10,
      total: rankings.length,
    }
  })

  const bySuppact = [...criteria].sort((a, b) => b.impact - a.impact)
  const strengths = bySuppact.filter((c) => c.delta > 0 && c.weight >= 40).slice(0, 3)
  const weaknesses = bySuppact.filter((c) => c.delta < -2).slice(-2).reverse()

  // Summary text
  const playerName = entry.player.shortName
  const totalProfiles = rankings.reduce((s, r) => s + r.count, 0)
  const pct = totalProfiles > 0 ? ((entry.count / totalProfiles) * 100).toFixed(1) : "0"

  let summary = ""
  if (entry.count === 0) {
    summary = `${playerName} não gerou perfis suficientes com os critérios atuais. Tente aumentar o peso de critérios onde ele se destaca.`
  } else if (strengths.length > 0) {
    const s1 = strengths[0]
    const s2 = strengths[1]
    summary = `${playerName} domina pela combinação de **${s1.label}** (${s1.playerAvg}pts, +${s1.delta} vs. média) com peso ${s1.weight}%`
    if (s2) summary += ` e **${s2.label}** (${s2.playerAvg}pts, +${s2.delta} vs. média) com peso ${s2.weight}%`
    summary += `. Isso garante ${pct}% dos perfis qualificados na simulação.`
  } else {
    summary = `${playerName} tem um perfil equilibrado. Gerou ${entry.count} perfis, representando ${pct}% do total qualificado.`
  }

  return { criteria, bySuppact, strengths, weaknesses, summary, pct }
}

// ─── Criteria bar (single criterion comparison) ─────────────────────────────

function CriterionBar({
  item,
  playerColor,
  rankings,
}: {
  item: ReturnType<typeof computeAnalysis>["criteria"][number]
  playerColor: string
  rankings: SimulationResult["rankings"]
}) {
  const allVals = rankings.map((r) => r.avgAttributes[item.key])
  const min = Math.min(...allVals)
  const max = Math.max(...allVals)
  const range = max - min || 1
  const playerPct = ((item.playerAvg - min) / range) * 100
  const globalPct = ((item.globalAvg - min) / range) * 100

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-300">{item.shortLabel}</span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black text-white tabular-nums">{item.playerAvg}</span>
          <span
            className={`text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded ${
              item.delta > 0
                ? "text-green-400 bg-green-400/10"
                : item.delta < 0
                ? "text-red-400 bg-red-400/10"
                : "text-slate-400 bg-slate-700/50"
            }`}
          >
            {item.delta > 0 ? "+" : ""}{item.delta}
          </span>
          <span className="text-[10px] text-slate-500 tabular-nums">#{item.rank}/{item.total}</span>
          <span className="text-[10px] text-amber-400/70">w={item.weight}%</span>
        </div>
      </div>
      <div className="relative h-2 bg-slate-700 rounded-full overflow-visible">
        {/* Global avg line */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-slate-400/60 z-10"
          style={{ left: `${globalPct}%` }}
        />
        {/* Player bar */}
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all"
          style={{
            width: `${playerPct}%`,
            background: `linear-gradient(90deg, ${playerColor}88, ${playerColor})`,
          }}
        />
      </div>
    </div>
  )
}

// ─── Summary text parser (bold markers) ─────────────────────────────────────

function SummaryText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/)
  return (
    <p className="text-sm text-slate-300 leading-relaxed">
      {parts.map((p, i) =>
        i % 2 === 0 ? (
          <span key={i}>{p}</span>
        ) : (
          <span key={i} className="text-white font-bold">{p}</span>
        )
      )}
    </p>
  )
}

// ─── Radar tooltip ────────────────────────────────────────────────────────────

const RadarTooltip = ({
  active,
  payload,
}: {
  active?: boolean
  payload?: { name: string; value: number }[]
}) => {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-2xl">
        {payload.map((p) => (
          <p key={p.name} className="text-xs text-slate-200">
            {p.name}: <span className="font-bold text-amber-400">{p.value.toFixed(1)}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DrilldownModal({ playerCode, result, weights, onClose }: DrilldownModalProps) {
  const [tab, setTab] = useState<Tab>("ganhou")

  const entry = playerCode
    ? result.rankings.find((r) => r.player.code === playerCode)
    : null

  const analysis = entry ? computeAnalysis(entry, weights, result.rankings) : null

  const radarData = entry
    ? (Object.keys(ATTRIBUTE_LABELS) as (keyof Weights)[]).map((key) => ({
        attribute: ATTRIBUTE_LABELS_SHORT[key],
        [entry.player.code]: entry.avgAttributes[key],
        "Média Global": GLOBAL_AVERAGES[key],
      }))
    : []

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "ganhou", label: "Por Que Ganhou", icon: <Trophy className="w-3.5 h-3.5" /> },
    { id: "cenario", label: "Melhor Cenário", icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: "criterios", label: "Critérios", icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: "radar", label: "Radar", icon: <RadarIcon className="w-3.5 h-3.5" /> },
  ]

  return (
    <AnimatePresence>
      {entry && analysis && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 24 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="px-6 pt-5 pb-4 flex items-center justify-between gap-3"
              style={{
                background: `linear-gradient(135deg, ${entry.player.color}18 0%, transparent 60%)`,
                borderBottom: `1px solid ${entry.player.color}30`,
              }}
            >
              <div className="flex items-center gap-3">
                <img
                  src={flagUrl(entry.player.countryCode)}
                  alt={entry.player.country}
                  width={52}
                  height={38}
                  className="rounded object-cover shadow-lg"
                  style={{ width: 52, height: 37 }}
                />
                <div>
                  <p className="text-[10px] text-amber-400/70 uppercase tracking-widest font-semibold">
                    Análise — Bola de Ouro
                  </p>
                  <h2 className="text-2xl font-black text-white leading-tight">{entry.player.name}</h2>
                  <p className="text-xs text-slate-400">{entry.player.country}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-black tabular-nums" style={{ color: entry.player.color }}>
                    {entry.count}
                  </p>
                  <p className="text-[10px] text-slate-500">perfis · {analysis.pct}%</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-white tabular-nums">
                    {entry.avgScore.toFixed(1)}
                  </p>
                  <p className="text-[10px] text-slate-500">score médio</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-500 hover:text-white transition-colors rounded-lg p-1.5 hover:bg-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-800 px-6">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
                    tab === t.id
                      ? "border-amber-400 text-amber-400"
                      : "border-transparent text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* ── TAB: Por Que Ganhou ── */}
              {tab === "ganhou" && (
                <div className="flex flex-col gap-5">
                  {/* Summary */}
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/60">
                    <p className="text-[10px] text-amber-400/70 uppercase tracking-widest font-bold mb-2">
                      Análise da Simulação
                    </p>
                    <SummaryText text={analysis.summary} />
                  </div>

                  {/* Strengths */}
                  {analysis.strengths.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> Pontos Fortes Decisivos
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.strengths.map((s) => (
                          <div
                            key={s.key}
                            className="flex items-center gap-2 bg-green-400/10 border border-green-400/30 rounded-lg px-3 py-2"
                          >
                            <TrendingUp className="w-3.5 h-3.5 text-green-400 shrink-0" />
                            <div>
                              <p className="text-[11px] font-bold text-green-300">{s.shortLabel}</p>
                              <p className="text-[10px] text-green-400/70">
                                {s.playerAvg}pts · +{s.delta} vs. média · peso {s.weight}%
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Weaknesses */}
                  {analysis.weaknesses.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" /> Pontos Fracos
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.weaknesses.map((w) => (
                          <div
                            key={w.key}
                            className="flex items-center gap-2 bg-red-400/10 border border-red-400/30 rounded-lg px-3 py-2"
                          >
                            <TrendingDown className="w-3.5 h-3.5 text-red-400 shrink-0" />
                            <div>
                              <p className="text-[11px] font-bold text-red-300">{w.shortLabel}</p>
                              <p className="text-[10px] text-red-400/70">
                                {w.playerAvg}pts · {w.delta} vs. média · peso {w.weight}%
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick rank table */}
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Ranking por critério (vs. outros jogadores)
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {analysis.bySuppact.map((c) => (
                        <div
                          key={c.key}
                          className="flex items-center justify-between bg-slate-800/40 rounded-lg px-3 py-1.5 border border-slate-700/40"
                        >
                          <span className="text-[10px] text-slate-400">{c.shortLabel}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-white">{c.playerAvg}</span>
                            <span
                              className={`text-[9px] font-bold px-1 py-0.5 rounded ${
                                c.rank === 1
                                  ? "bg-amber-400/20 text-amber-400"
                                  : c.rank <= 3
                                  ? "bg-green-400/15 text-green-400"
                                  : c.rank >= c.total - 1
                                  ? "bg-red-400/15 text-red-400"
                                  : "bg-slate-700 text-slate-400"
                              }`}
                            >
                              #{c.rank}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB: Melhor Cenário ── */}
              {tab === "cenario" && (() => {
                const won = entry.count > 0
                const scenarioScore = (won ? entry.bestWinScore : entry.bestScore) ?? 0
                const scenarioAttrs = (won ? entry.bestWinAttributes : entry.bestAttributes) ?? entry.avgAttributes

                return (
                  <div className="flex flex-col gap-5">
                    {/* Header */}
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/60 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] text-amber-400/70 uppercase tracking-widest font-bold mb-1">
                          {won ? "Melhor Vitória" : "Melhor Performance"}
                        </p>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {won
                            ? `Este foi o cenário exato em que ${entry.player.shortName} obteve o maior score e venceu a eleição da Bola de Ouro entre os 10.000 simulados.`
                            : `${entry.player.shortName} não venceu nenhuma eleição nos 10.000 cenários. Esta foi sua melhor performance individual.`}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-3xl font-black tabular-nums" style={{ color: entry.player.color }}>
                          {scenarioScore.toFixed(1)}
                        </p>
                        <p className="text-[10px] text-slate-500">score do cenário</p>
                      </div>
                    </div>

                    {/* Atributos do cenário vs média */}
                    <div className="flex flex-col gap-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Atributos neste cenário vs. média do jogador
                      </p>
                      {(Object.keys(ATTRIBUTE_LABELS) as (keyof Weights)[]).map((key) => {
                        const scenarioVal = Math.round((scenarioAttrs[key] ?? 0) * 10) / 10
                        const avgVal = Math.round(entry.avgAttributes[key] * 10) / 10
                        const diff = Math.round((scenarioVal - avgVal) * 10) / 10
                        const pctScenario = scenarioVal
                        const pctAvg = avgVal

                        return (
                          <div key={key} className="flex flex-col gap-0.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-semibold text-slate-300">
                                {ATTRIBUTE_LABELS_SHORT[key]}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-black text-white tabular-nums">
                                  {scenarioVal}
                                </span>
                                <span className={`text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded ${
                                  diff > 0
                                    ? "text-green-400 bg-green-400/10"
                                    : diff < 0
                                    ? "text-red-400 bg-red-400/10"
                                    : "text-slate-400 bg-slate-700/50"
                                }`}>
                                  {diff > 0 ? "+" : ""}{diff} vs média
                                </span>
                              </div>
                            </div>
                            <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
                              {/* Média (linha base) */}
                              <div
                                className="absolute top-0 h-full rounded-full opacity-30"
                                style={{ width: `${pctAvg}%`, backgroundColor: entry.player.color }}
                              />
                              {/* Cenário (barra principal) */}
                              <div
                                className="absolute top-0 h-full rounded-full"
                                style={{
                                  width: `${pctScenario}%`,
                                  background: `linear-gradient(90deg, ${entry.player.color}88, ${entry.player.color})`,
                                  boxShadow: diff > 5 ? `0 0 6px ${entry.player.color}80` : "none",
                                }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="flex items-center gap-4 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <span className="w-4 h-2 rounded inline-block opacity-30" style={{ backgroundColor: entry.player.color }} /> Média do jogador
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-4 h-2 rounded inline-block" style={{ backgroundColor: entry.player.color }} /> Neste cenário
                      </span>
                    </div>
                  </div>
                )
              })()}

              {/* ── TAB: Critérios ── */}
              {tab === "criterios" && (
                <div className="flex flex-col gap-4">
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Cada barra mostra o score médio de{" "}
                    <span className="text-white font-semibold">{entry.player.shortName}</span>{" "}
                    em relação a todos os jogadores. A linha vertical é a <span className="text-slate-300 font-semibold">média global</span>.
                    O rótulo mostra ± diferença da média e ranking (#) entre os {result.rankings.length} jogadores.
                  </p>
                  <div className="flex flex-col gap-3">
                    {analysis.bySuppact.map((item) => (
                      <CriterionBar
                        key={item.key}
                        item={item}
                        playerColor={entry.player.color}
                        rankings={result.rankings}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-0.5 bg-slate-400/60 inline-block" /> Média global
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-2 rounded inline-block" style={{ background: entry.player.color }} /> Score do jogador
                    </span>
                    <span>w = peso na fórmula</span>
                  </div>
                </div>
              )}

              {/* ── TAB: Radar ── */}
              {tab === "radar" && (
                <div className="flex flex-col gap-3">
                  <p className="text-[10px] text-slate-500">
                    Comparação do perfil médio simulado de{" "}
                    <span className="text-white font-semibold">{entry.player.shortName}</span>{" "}
                    contra a média global de todos os jogadores.
                  </p>
                  <ResponsiveContainer width="100%" height={340}>
                    <RadarChart data={radarData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="attribute" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={{ fill: "#475569", fontSize: 9 }}
                        tickCount={4}
                      />
                      <Tooltip content={<RadarTooltip />} />
                      <Legend
                        formatter={(value) => (
                          <span style={{ color: "#94a3b8", fontSize: 12 }}>
                            {value === entry.player.code ? entry.player.shortName : value}
                          </span>
                        )}
                      />
                      <Radar
                        name={entry.player.code}
                        dataKey={entry.player.code}
                        stroke={entry.player.color}
                        fill={entry.player.color}
                        fillOpacity={0.35}
                        strokeWidth={2}
                      />
                      <Radar
                        name="Média Global"
                        dataKey="Média Global"
                        stroke="#ffffff"
                        fill="transparent"
                        strokeWidth={1.5}
                        strokeDasharray="4 3"
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

"use client"

import { useState, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Trophy, RotateCcw, Maximize2 } from "lucide-react"
import { PLAYERS, flagUrl } from "@/lib/monte-carlo"
import { Button } from "@/components/ui/button"
import { WeightsPanel } from "@/components/dashboard/WeightsPanel"
import { LoadingOverlay } from "@/components/dashboard/LoadingOverlay"
import { CelebrationScreen } from "@/components/dashboard/CelebrationScreen"
import { PodiumCards } from "@/components/dashboard/PodiumCards"
import { KpiCards } from "@/components/dashboard/KpiCards"
import { RankingChart } from "@/components/dashboard/RankingChart"
import { VarianceChart } from "@/components/dashboard/VarianceChart"
import { HistogramChart } from "@/components/dashboard/HistogramChart"
import { ConvergenceChart } from "@/components/dashboard/ConvergenceChart"
import { SensitivityChart } from "@/components/dashboard/SensitivityChart"
import { ScatterPlot } from "@/components/dashboard/ScatterPlot"
import { RadarCompareChart } from "@/components/dashboard/RadarCompareChart"
import { PositionChart } from "@/components/dashboard/PositionChart"
import { DrilldownModal } from "@/components/dashboard/DrilldownModal"
import { ChartExpandModal } from "@/components/dashboard/ChartExpandModal"
import { runMonteCarlo, type Weights, type SimulationResult } from "@/lib/monte-carlo"
import { PixelPlayer } from "@/components/dashboard/PixelPlayer"

type AppState = "idle" | "loading" | "celebration" | "results"

// Pesos somam 100 — cada valor representa % real do critério
const DEFAULT_WEIGHTS: Weights = {
  gols: 12,
  assistencias: 10,
  titulosIndividuais: 14,
  ligaNacional: 8,
  copaNacional: 5,
  copaContinentalClubes: 18,
  mundialClubes: 7,
  copaContinentalSelecao: 11,
  copaMundo: 15,
}

const CHART_CARD = "bg-slate-800/30 border border-slate-700/50 rounded-2xl p-5 relative group transition-colors hover:border-amber-400/25"

type ExpandableChart = "ranking" | "sensitivity" | "histogram" | "convergence" | "scatter" | "variance" | "radar" | "position"

const CHART_TITLES: Record<ExpandableChart, string> = {
  ranking: "Ranking dos Candidatos",
  sensitivity: "Análise de Sensibilidade",
  histogram: "Distribuição de Scores",
  convergence: "Convergência Monte Carlo",
  scatter: "Coletivo vs Individual",
  variance: "Curva de Variância Estocástica",
  radar: "Comparação de Atributos — Teia de Aranha",
  position: "Vitórias por Posição",
}

export default function Dashboard() {
  const [appState, setAppState] = useState<AppState>("idle")
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS)
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null)
  const [expandedChart, setExpandedChart] = useState<ExpandableChart | null>(null)
  const [simCount, setSimCount] = useState(10_000)

  const handleWeightChange = useCallback((key: keyof Weights, value: number) => {
    setWeights((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleApplyPreset = useCallback((w: Weights) => {
    setWeights(w)
  }, [])

  const runSimulation = useCallback(() => {
    setAppState("loading")
    setTimeout(() => {
      const simResult = runMonteCarlo(weights, simCount)
      setResult(simResult)
      setAppState("celebration")
      setTimeout(() => setAppState("results"), 3200)
    }, 2200)
  }, [weights, simCount])

  const resetSimulation = useCallback(() => {
    setAppState("idle")
    setResult(null)
    setSelectedPlayer(null)
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <AnimatePresence>{appState === "loading" && <LoadingOverlay simCount={simCount} />}</AnimatePresence>

      <AnimatePresence>
        {appState === "celebration" && result && (
          <CelebrationScreen winner={result.rankings[0].player} />
        )}
      </AnimatePresence>

      {result && (
        <DrilldownModal
          playerCode={selectedPlayer}
          result={result}
          weights={weights}
          onClose={() => setSelectedPlayer(null)}
        />
      )}

      <AnimatePresence>
        {expandedChart && result && (
          <ChartExpandModal
            title={CHART_TITLES[expandedChart]}
            onClose={() => setExpandedChart(null)}
          >
            {expandedChart === "ranking" && <RankingChart result={result} onPlayerClick={setSelectedPlayer} />}
            {expandedChart === "sensitivity" && <SensitivityChart result={result} weights={weights} />}
            {expandedChart === "histogram" && <HistogramChart result={result} />}
            {expandedChart === "convergence" && <ConvergenceChart result={result} />}
            {expandedChart === "scatter" && <ScatterPlot result={result} />}
            {expandedChart === "variance" && <VarianceChart result={result} />}
            {expandedChart === "radar" && <RadarCompareChart result={result} />}
            {expandedChart === "position" && <PositionChart result={result} />}
          </ChartExpandModal>
        )}
      </AnimatePresence>

      {/* Header */}
      <header
        className="sticky top-0 z-30 w-full px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        style={{
          background: "linear-gradient(to bottom, #080d1a, #0f172a)",
          borderBottom: "1px solid transparent",
          borderImage: "linear-gradient(90deg, transparent 0%, #FBBF24 30%, #FDE68A 60%, transparent 100%) 1",
        }}
      >
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-amber-400 shrink-0" style={{ filter: "drop-shadow(0 0 8px #FBBF24)" }} />
            <h1
              className="text-xl sm:text-2xl font-black tracking-tight"
              style={{
                background: "linear-gradient(135deg, #FBBF24 0%, #FDE68A 55%, #F59E0B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              O Algoritmo da Bola de Ouro
            </h1>
          </div>
          <p className="text-xs text-slate-400 pl-9">
            Simulação Estocástica &bull; {simCount.toLocaleString("pt-BR")} iterações &bull; Monte Carlo
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {appState === "results" && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetSimulation}
              className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 bg-transparent text-xs gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Resetar
            </Button>
          )}
          <Button
            onClick={runSimulation}
            disabled={appState === "loading" || appState === "celebration"}
            className="gap-2 font-bold text-slate-900 text-sm px-5 disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #F59E0B, #FBBF24)",
              boxShadow: "0 0 16px rgba(251,191,36,0.4)",
            }}
          >
            <Trophy className="w-4 h-4" />
            Rodar Simulação Estocástica
          </Button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-73px)]">
        <aside className="w-full lg:w-72 xl:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-800 p-5 bg-slate-900/40 lg:overflow-y-auto lg:max-h-[calc(100vh-73px)]">
          <WeightsPanel
            weights={weights}
            onChange={handleWeightChange}
            onApplyPreset={handleApplyPreset}
            simCount={simCount}
            onSimCountChange={setSimCount}
          />
        </aside>

        <main className="flex-1 p-5 flex flex-col gap-6 overflow-auto">
          <AnimatePresence mode="wait">
            {/* IDLE */}
            {appState === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center gap-8 py-10 text-center"
              >
                <div className="flex items-end gap-8">
                  <PixelPlayer />
                  <motion.div
                    animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    style={{ filter: "drop-shadow(0 0 36px rgba(251,191,36,0.55))" }}
                  >
                    <Trophy className="w-20 h-20 text-amber-400" />
                  </motion.div>
                  <PixelPlayer />
                </div>

                <div className="flex flex-col gap-3 max-w-lg">
                  <h2 className="text-3xl font-black text-white text-balance leading-tight">
                    Defina sua fórmula e descubra quem ganha a Bola de Ouro.
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Ajuste os critérios à esquerda e clique em{" "}
                    <span className="text-amber-400 font-semibold">Rodar Simulação</span> para
                    iniciar o processo Monte Carlo com 10.000 perfis.
                  </p>
                </div>

                {/* Players grid — scrollável */}
                <div className="flex flex-col gap-2 w-full max-w-3xl">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                      {PLAYERS.length} candidatos em disputa
                    </p>
                    <span className="text-[10px] text-slate-600">scroll para ver todos ↓</span>
                  </div>
                  <div
                    className="grid gap-1.5 overflow-y-auto pr-1"
                    style={{
                      gridTemplateColumns: "repeat(8, minmax(0, 1fr))",
                      maxHeight: 260,
                    }}
                  >
                    {PLAYERS.map((player, i) => (
                      <motion.div
                        key={player.code}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: Math.min(i * 0.02, 0.6) }}
                        className="flex flex-col items-center gap-1 rounded-lg border bg-slate-800/30 p-1.5"
                        style={{ borderColor: `${player.color}30` }}
                      >
                        <img
                          src={flagUrl(player.countryCode)}
                          alt={player.country}
                          width={28}
                          height={20}
                          className="rounded-sm object-cover"
                          style={{ width: 28, height: 20 }}
                        />
                        <span className="text-[9px] font-bold text-slate-300 text-center leading-tight truncate w-full text-center">
                          {player.shortName}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={runSimulation}
                  size="lg"
                  className="gap-2 font-bold text-slate-900 px-8 text-base"
                  style={{
                    background: "linear-gradient(135deg, #F59E0B, #FBBF24)",
                    boxShadow: "0 0 28px rgba(251,191,36,0.5)",
                  }}
                >
                  <Trophy className="w-5 h-5" />
                  Rodar Simulação Estocástica
                </Button>
              </motion.div>
            )}

            {/* RESULTS */}
            {appState === "results" && result && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col gap-6"
              >
                <PodiumCards result={result} />

                <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

                <KpiCards result={result} />

                {/* Linha 1: Ranking + Sensibilidade */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  <div className={CHART_CARD}>
                    <button
                      onClick={() => setExpandedChart("ranking")}
                      className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700/80 hover:bg-amber-400/20 border border-slate-600 hover:border-amber-400/50 rounded-lg p-1.5"
                      title="Expandir gráfico"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                    <RankingChart result={result} onPlayerClick={setSelectedPlayer} />
                  </div>
                  <div className={CHART_CARD}>
                    <button
                      onClick={() => setExpandedChart("sensitivity")}
                      className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700/80 hover:bg-amber-400/20 border border-slate-600 hover:border-amber-400/50 rounded-lg p-1.5"
                      title="Expandir gráfico"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                    <SensitivityChart result={result} weights={weights} />
                  </div>
                </div>

                {/* Linha 2: Histograma + Convergência */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  <div className={CHART_CARD}>
                    <button
                      onClick={() => setExpandedChart("histogram")}
                      className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700/80 hover:bg-amber-400/20 border border-slate-600 hover:border-amber-400/50 rounded-lg p-1.5"
                      title="Expandir gráfico"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                    <HistogramChart result={result} />
                  </div>
                  <div className={CHART_CARD}>
                    <button
                      onClick={() => setExpandedChart("convergence")}
                      className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700/80 hover:bg-amber-400/20 border border-slate-600 hover:border-amber-400/50 rounded-lg p-1.5"
                      title="Expandir gráfico"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                    <ConvergenceChart result={result} />
                  </div>
                </div>

                {/* Linha 3: Scatter + Variância */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  <div className={CHART_CARD}>
                    <button
                      onClick={() => setExpandedChart("scatter")}
                      className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700/80 hover:bg-amber-400/20 border border-slate-600 hover:border-amber-400/50 rounded-lg p-1.5"
                      title="Expandir gráfico"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                    <ScatterPlot result={result} />
                  </div>
                  <div className={CHART_CARD}>
                    <button
                      onClick={() => setExpandedChart("variance")}
                      className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700/80 hover:bg-amber-400/20 border border-slate-600 hover:border-amber-400/50 rounded-lg p-1.5"
                      title="Expandir gráfico"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                    <VarianceChart result={result} />
                  </div>
                </div>

                {/* Linha 4: Radar + Posição */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  <div className={CHART_CARD}>
                    <button
                      onClick={() => setExpandedChart("radar")}
                      className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700/80 hover:bg-amber-400/20 border border-slate-600 hover:border-amber-400/50 rounded-lg p-1.5"
                      title="Expandir gráfico"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                    <RadarCompareChart result={result} />
                  </div>
                  <div className={CHART_CARD}>
                    <button
                      onClick={() => setExpandedChart("position")}
                      className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700/80 hover:bg-amber-400/20 border border-slate-600 hover:border-amber-400/50 rounded-lg p-1.5"
                      title="Expandir gráfico"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                    <PositionChart result={result} />
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

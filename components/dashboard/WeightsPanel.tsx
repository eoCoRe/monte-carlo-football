"use client"

import { useState } from "react"
import {
  Trophy, Star, Landmark, Shield, Globe, Globe2, Flag, Target, RotateCcw, Clock,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import type { Weights } from "@/lib/monte-carlo"

const SIM_OPTIONS: { value: number; label: string; time?: string }[] = [
  { value: 1_000,     label: "1K" },
  { value: 10_000,    label: "10K" },
  { value: 100_000,   label: "100K",  time: "~2s" },
  { value: 500_000,   label: "500K",  time: "~10s" },
  { value: 1_000_000, label: "1M",    time: "~20s" },
]

interface WeightsPanelProps {
  weights: Weights
  onChange: (key: keyof Weights, value: number) => void
  simCount: number
  onSimCountChange: (n: number) => void
}

type Tab = "clube" | "selecao"

// Todos os presets somam exatamente 100 pontos
// Artilheiro  → Haaland domina (gols: 45)
// Rei da Champions → Corrida acirrada UCL (CL: 50 — Messi/CR7/Benzema/Vini/Modrić todos 92–94)
// Herói da Copa → foco em Seleção (copaMundo+copaContinSel = 58)
// Grande Disputa ★ → Liga+CL equiponderados, 5+ candidatos dentro de ~8 pts
const PRESETS: { label: string; desc: string; icon: React.ReactNode; values: Weights; highlight?: boolean }[] = [
  {
    label: "Artilheiro",
    desc: "Gols decidem — Haaland é o favorito",
    icon: <Target className="w-3.5 h-3.5" />,
    values: { gols: 45, assistencias: 16, titulosIndividuais: 10, ligaNacional: 8, copaNacional: 5, copaContinentalClubes: 8, mundialClubes: 4, copaContinentalSelecao: 2, copaMundo: 2 },
  },
  {
    label: "Rei da Champions",
    desc: "UCL é o critério supremo — raça acirrada",
    icon: <Globe className="w-3.5 h-3.5" />,
    values: { gols: 5, assistencias: 5, titulosIndividuais: 1, ligaNacional: 15, copaNacional: 7, copaContinentalClubes: 50, mundialClubes: 10, copaContinentalSelecao: 5, copaMundo: 2 },
  },
  {
    label: "Herói da Copa",
    desc: "Copa do Mundo é o sonho maior",
    icon: <Flag className="w-3.5 h-3.5" />,
    values: { gols: 4, assistencias: 4, titulosIndividuais: 8, ligaNacional: 8, copaNacional: 5, copaContinentalClubes: 7, mundialClubes: 6, copaContinentalSelecao: 28, copaMundo: 30 },
  },
  {
    label: "Grande Disputa",
    desc: "5 candidatos em corrida acirrada ★",
    icon: <Trophy className="w-3.5 h-3.5" />,
    values: { gols: 10, assistencias: 10, titulosIndividuais: 1, ligaNacional: 30, copaNacional: 10, copaContinentalClubes: 30, mundialClubes: 5, copaContinentalSelecao: 3, copaMundo: 1 },
    highlight: true,
  },
]

const ZERO_WEIGHTS: Weights = {
  gols: 0, assistencias: 0, titulosIndividuais: 0,
  ligaNacional: 0, copaNacional: 0, copaContinentalClubes: 0,
  mundialClubes: 0, copaContinentalSelecao: 0, copaMundo: 0,
}

function SliderRow({
  label, icon, keyName, weights, totalPts, onChange,
}: {
  label: string; icon: React.ReactNode; keyName: keyof Weights
  weights: Weights; totalPts: number; onChange: (key: keyof Weights, value: number) => void
}) {
  const val = weights[keyName]
  const remaining = 100 - totalPts
  // Máximo físico = valor atual + quanto ainda cabe no orçamento
  const maxAllowed = val + Math.max(0, remaining)
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {icon}
          <span className="text-xs font-medium text-slate-200">{label}</span>
        </div>
        <span className="text-xs font-bold text-amber-400 tabular-nums w-7 text-right">
          {val}
        </span>
      </div>
      <Slider
        min={0} max={maxAllowed} step={1}
        value={[val]}
        onValueChange={([v]) => onChange(keyName, Math.min(v, maxAllowed))}
        className="[&_[role=slider]]:bg-amber-400 [&_[role=slider]]:border-amber-500 [&_.relative]:bg-slate-700 [&_[data-orientation=horizontal]_.absolute]:bg-amber-400"
      />
    </div>
  )
}

export function WeightsPanel({ weights, onChange, simCount, onSimCountChange }: WeightsPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("clube")

  const totalPts = Object.values(weights).reduce((a, b) => a + b, 0)
  const remaining = 100 - totalPts

  const applyPreset = (values: Weights) => {
    ;(Object.keys(values) as (keyof Weights)[]).forEach((key) => onChange(key, values[key]))
  }

  const zerar = () => {
    ;(Object.keys(ZERO_WEIGHTS) as (keyof Weights)[]).forEach((key) => onChange(key, 0))
  }

  const totalBarColor = totalPts === 100 ? "#22C55E" : "#FBBF24"

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-widest mb-1">
          Critérios da Bola de Ouro
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Distribua <span className="text-amber-400 font-bold">100 pontos</span> entre os critérios. O Monte Carlo simulará 10.000 eleições.
        </p>
      </div>

      {/* Barra de orçamento */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Pontos distribuídos</span>
          <span className="font-black tabular-nums" style={{ color: totalBarColor }}>
            {totalPts} / 100
          </span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{
              width: `${Math.min(totalPts, 100)}%`,
              backgroundColor: totalBarColor,
              boxShadow: totalPts === 100 ? `0 0 8px ${totalBarColor}80` : "none",
            }}
          />
        </div>
        {totalPts < 100 && totalPts > 0 && (
          <p className="text-[10px] text-amber-400/60">
            Restam {remaining} pts para distribuir.
          </p>
        )}
        {totalPts === 100 && (
          <p className="text-[10px] text-green-400">
            ✓ Orçamento completo.
          </p>
        )}
      </div>

      {/* Presets */}
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
          Cenários Pré-Definidos
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => applyPreset(preset.values)}
              title={preset.desc}
              className={`flex flex-col items-start gap-1 rounded-lg border px-2.5 py-2 text-[10px] font-medium transition-all duration-150 active:scale-95 ${
                preset.highlight
                  ? "border-amber-400/50 bg-amber-400/8 text-amber-300 hover:border-amber-400/80 hover:bg-amber-400/15"
                  : "border-slate-700 bg-slate-800/40 text-slate-300 hover:border-amber-400/60 hover:bg-amber-400/10 hover:text-amber-300"
              }`}
            >
              <span className={preset.highlight ? "text-amber-400" : "text-slate-400"}>
                {preset.icon}
              </span>
              <span className="font-bold leading-tight">{preset.label}</span>
              <span className={`text-[9px] leading-tight ${preset.highlight ? "text-amber-400/70" : "text-slate-500"}`}>
                {preset.desc}
              </span>
            </button>
          ))}
        </div>

      </div>

      {/* Iterações Monte Carlo */}
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
          Iterações Monte Carlo
        </p>
        <div className="grid grid-cols-5 gap-1">
          {SIM_OPTIONS.map((opt) => {
            const active = simCount === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => onSimCountChange(opt.value)}
                title={opt.time ? `Estimativa: ${opt.time}` : undefined}
                className={`flex flex-col items-center gap-0.5 rounded-lg border px-1 py-2 text-[10px] font-bold transition-all duration-150 active:scale-95 ${
                  active
                    ? "border-amber-400/80 bg-amber-400/15 text-amber-300"
                    : "border-slate-700 bg-slate-800/40 text-slate-400 hover:border-amber-400/40 hover:text-amber-400/80"
                }`}
              >
                {opt.label}
                {opt.time && (
                  <span className={`text-[8px] font-normal ${active ? "text-amber-400/70" : "text-slate-600"}`}>
                    {opt.time}
                  </span>
                )}
              </button>
            )
          })}
        </div>
        {simCount > 10_000 && (
          <p className="flex items-center gap-1 text-[9px] text-amber-400/60">
            <Clock className="w-2.5 h-2.5" />
            Simulações pesadas podem demorar alguns segundos.
          </p>
        )}
      </div>

      <Separator className="bg-slate-800" />

      {/* Desempenho Individual */}
      <div className="flex flex-col gap-3">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
          Desempenho Individual
        </p>
        <div className="flex flex-col gap-3">
          <SliderRow label="Gols" icon={<Target className="w-3.5 h-3.5 text-red-400" />}
            keyName="gols" weights={weights} totalPts={totalPts} onChange={onChange} />
          <SliderRow label="Assistências" icon={<Target className="w-3.5 h-3.5 text-sky-400" />}
            keyName="assistencias" weights={weights} totalPts={totalPts} onChange={onChange} />
          <SliderRow label="Títulos Individuais" icon={<Star className="w-3.5 h-3.5 text-amber-400" />}
            keyName="titulosIndividuais" weights={weights} totalPts={totalPts} onChange={onChange} />
        </div>
      </div>

      <Separator className="bg-slate-800" />

      {/* Títulos Coletivos */}
      <div className="flex flex-col gap-3">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
          Títulos Coletivos
        </p>
        <div className="flex rounded-lg border border-slate-700 overflow-hidden bg-slate-900/50">
          <button
            onClick={() => setActiveTab("clube")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold transition-all ${
              activeTab === "clube"
                ? "bg-amber-400/15 text-amber-400 border-r border-amber-400/30"
                : "text-slate-400 hover:text-slate-200 border-r border-slate-700"
            }`}
          >
            <Landmark className="w-3.5 h-3.5" /> Clube
          </button>
          <button
            onClick={() => setActiveTab("selecao")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold transition-all ${
              activeTab === "selecao"
                ? "bg-amber-400/15 text-amber-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Flag className="w-3.5 h-3.5" /> Seleção
          </button>
        </div>

        {activeTab === "clube" ? (
          <div className="flex flex-col gap-3">
            <SliderRow label="Liga Nacional" icon={<Landmark className="w-3.5 h-3.5 text-blue-400" />}
              keyName="ligaNacional" weights={weights} totalPts={totalPts} onChange={onChange} />
            <SliderRow label="Copa Nacional" icon={<Trophy className="w-3.5 h-3.5 text-green-400" />}
              keyName="copaNacional" weights={weights} totalPts={totalPts} onChange={onChange} />
            <SliderRow label="Copa Continental" icon={<Globe className="w-3.5 h-3.5 text-purple-400" />}
              keyName="copaContinentalClubes" weights={weights} totalPts={totalPts} onChange={onChange} />
            <SliderRow label="Mundial de Clubes" icon={<Globe2 className="w-3.5 h-3.5 text-cyan-400" />}
              keyName="mundialClubes" weights={weights} totalPts={totalPts} onChange={onChange} />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <SliderRow label="Copa Continental" icon={<Globe className="w-3.5 h-3.5 text-orange-400" />}
              keyName="copaContinentalSelecao" weights={weights} totalPts={totalPts} onChange={onChange} />
            <SliderRow label="Copa do Mundo" icon={<Shield className="w-3.5 h-3.5 text-amber-400" />}
              keyName="copaMundo" weights={weights} totalPts={totalPts} onChange={onChange} />
          </div>
        )}
      </div>

      <div className="rounded-xl border border-amber-900/40 bg-slate-900/80 p-4">
        <p className="text-xs text-amber-400/70 uppercase tracking-widest mb-2 font-semibold">
          Fórmula Estocástica
        </p>
        <code className="text-xs text-amber-300 font-mono leading-relaxed block">
          Score = Σ(w<sub>i</sub> × X<sub>i</sub>) / Σw
        </code>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          X<sub>i</sub> ~ 𝒩(μ<sub>jogador</sub>, σ²) via Monte Carlo
        </p>
      </div>

      {/* Botão Zerar */}
      <button
        onClick={zerar}
        className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/40 px-3 py-2.5 text-[11px] font-semibold text-slate-400 transition-all duration-150 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 active:scale-95"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Zerar todos os critérios
      </button>
    </div>
  )
}

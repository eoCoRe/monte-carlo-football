"use client"

import { useState } from "react"
import {
  Trophy, Star, Landmark, Shield, Globe, Globe2, Flag, Target,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import type { Weights } from "@/lib/monte-carlo"

interface WeightsPanelProps {
  weights: Weights
  onChange: (key: keyof Weights, value: number) => void
  legendasMode: boolean
  onLegendasToggle: () => void
}

type Tab = "clube" | "selecao"

const PRESETS: { label: string; icon: React.ReactNode; values: Partial<Weights> }[] = [
  {
    label: "Goleador",
    icon: <Target className="w-3.5 h-3.5" />,
    values: { gols: 100, titulosIndividuais: 80, copaMundo: 50, copaContinentalClubes: 60, ligaNacional: 40, copaNacional: 30, mundialClubes: 30, copaContinentalSelecao: 50 },
  },
  {
    label: "Campeão",
    icon: <Trophy className="w-3.5 h-3.5" />,
    values: { copaMundo: 100, copaContinentalSelecao: 90, copaContinentalClubes: 80, mundialClubes: 70, ligaNacional: 60, copaNacional: 50, gols: 50, titulosIndividuais: 40 },
  },
  {
    label: "Lenda",
    icon: <Star className="w-3.5 h-3.5" />,
    values: { titulosIndividuais: 100, gols: 90, copaMundo: 80, copaContinentalClubes: 80, ligaNacional: 70, copaNacional: 60, copaContinentalSelecao: 80, mundialClubes: 60 },
  },
]

function SliderRow({
  label, icon, keyName, weights, onChange,
}: {
  label: string; icon: React.ReactNode; keyName: keyof Weights
  weights: Weights; onChange: (key: keyof Weights, value: number) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {icon}
          <span className="text-xs font-medium text-slate-200">{label}</span>
        </div>
        <span className="text-xs font-bold text-amber-400 tabular-nums w-8 text-right">
          {weights[keyName]}%
        </span>
      </div>
      <Slider
        min={0} max={100} step={1}
        value={[weights[keyName]]}
        onValueChange={([v]) => onChange(keyName, v)}
        className="[&_[role=slider]]:bg-amber-400 [&_[role=slider]]:border-amber-500 [&_.relative]:bg-slate-700 [&_[data-orientation=horizontal]_.absolute]:bg-amber-400"
      />
    </div>
  )
}

export function WeightsPanel({ weights, onChange, legendasMode, onLegendasToggle }: WeightsPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("clube")

  const applyPreset = (values: Partial<Weights>) => {
    ;(Object.keys(values) as (keyof Weights)[]).forEach((key) => {
      onChange(key, values[key]!)
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-widest mb-1">
          Critérios da Bola de Ouro
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Defina o peso de cada critério. O Monte Carlo simulará 10.000 perfis com base nessa fórmula.
        </p>
      </div>

      {/* Cenários */}
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
          Cenários Pré-Definidos
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => applyPreset(preset.values)}
              className="flex flex-col items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/40 px-2 py-2 text-[10px] font-medium text-slate-300 transition-all duration-150 hover:border-amber-400/60 hover:bg-amber-400/10 hover:text-amber-300 active:scale-95"
            >
              <span className="text-slate-400">{preset.icon}</span>
              {preset.label}
            </button>
          ))}
        </div>

        {/* Botão AS Lendas — cenário especial */}
        <button
          onClick={onLegendasToggle}
          className={`w-full flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-[11px] font-bold transition-all duration-150 active:scale-95 ${
            legendasMode
              ? "border-amber-400/80 bg-amber-400/15 text-amber-300"
              : "border-slate-700 bg-slate-800/40 text-slate-400 hover:border-amber-400/40 hover:text-amber-400/80"
          }`}
        >
          <span className="text-base leading-none">🐀</span>
          AS LENDAS DO BAIRRO
          {legendasMode && (
            <span className="ml-auto text-[9px] bg-amber-400/20 border border-amber-400/40 text-amber-400 rounded-full px-1.5 py-0.5">
              ATIVO
            </span>
          )}
        </button>
        {legendasMode && (
          <p className="text-[9px] text-amber-400/60 text-center leading-relaxed">
            Caça Rato · Deyerson · Lima Matador aparecem nos resultados
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
            keyName="gols" weights={weights} onChange={onChange} />
          <SliderRow label="Títulos Individuais" icon={<Star className="w-3.5 h-3.5 text-amber-400" />}
            keyName="titulosIndividuais" weights={weights} onChange={onChange} />
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
              keyName="ligaNacional" weights={weights} onChange={onChange} />
            <SliderRow label="Copa Nacional" icon={<Trophy className="w-3.5 h-3.5 text-green-400" />}
              keyName="copaNacional" weights={weights} onChange={onChange} />
            <SliderRow label="Copa Continental" icon={<Globe className="w-3.5 h-3.5 text-purple-400" />}
              keyName="copaContinentalClubes" weights={weights} onChange={onChange} />
            <SliderRow label="Mundial de Clubes" icon={<Globe2 className="w-3.5 h-3.5 text-cyan-400" />}
              keyName="mundialClubes" weights={weights} onChange={onChange} />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <SliderRow label="Copa Continental" icon={<Globe className="w-3.5 h-3.5 text-orange-400" />}
              keyName="copaContinentalSelecao" weights={weights} onChange={onChange} />
            <SliderRow label="Copa do Mundo" icon={<Shield className="w-3.5 h-3.5 text-amber-400" />}
              keyName="copaMundo" weights={weights} onChange={onChange} />
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
    </div>
  )
}

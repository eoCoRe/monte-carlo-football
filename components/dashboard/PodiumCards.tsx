"use client"

import { motion } from "framer-motion"
import { Medal } from "lucide-react"
import type { SimulationResult } from "@/lib/monte-carlo"
import { flagUrl } from "@/lib/monte-carlo"

interface PodiumCardsProps {
  result: SimulationResult
}

const MEDALS = [
  { label: "Ouro", color: "#FBBF24", glow: "shadow-[0_0_20px_rgba(251,191,36,0.4)]", border: "border-amber-400/60" },
  { label: "Prata", color: "#C0C0C0", glow: "shadow-[0_0_12px_rgba(192,192,192,0.3)]", border: "border-slate-400/50" },
  { label: "Bronze", color: "#CD7F32", glow: "shadow-[0_0_12px_rgba(205,127,50,0.3)]", border: "border-amber-700/50" },
]

function FlagImg({ countryCode, country, size = 32 }: { countryCode: string; country: string; size?: number }) {
  return (
    <img
      src={flagUrl(countryCode)}
      alt={country}
      width={size}
      height={Math.round(size * 0.67)}
      className="rounded-sm object-cover shadow"
      style={{ width: size, height: Math.round(size * 0.67) }}
    />
  )
}

export function PodiumCards({ result }: PodiumCardsProps) {
  const top3 = result.rankings.slice(0, 3)

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xs uppercase tracking-widest text-amber-400/60 font-semibold"
      >
        Pódio Estocástico
      </motion.p>
      <div className="flex items-end gap-4 w-full justify-center">
        {/* Prata — 2º */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
          className={`flex flex-col items-center gap-2 rounded-2xl border ${MEDALS[1].border} bg-slate-800/60 p-4 ${MEDALS[1].glow} w-36`}
        >
          <FlagImg countryCode={top3[1]?.player.countryCode ?? ""} country={top3[1]?.player.country ?? ""} size={36} />
          <span className="text-xs font-bold text-slate-300 text-center leading-tight">
            {top3[1]?.player.shortName}
          </span>
          <span className="text-[10px] text-slate-500">{top3[1]?.player.country}</span>
          <Medal className="w-4 h-4" style={{ color: MEDALS[1].color }} />
          <span className="text-lg font-black tabular-nums" style={{ color: MEDALS[1].color }}>
            {top3[1]?.count}
          </span>
          <span className="text-[10px] text-slate-500">perfis</span>
        </motion.div>

        {/* Ouro — 1º */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, type: "spring" }}
          className={`flex flex-col items-center gap-2 rounded-2xl border ${MEDALS[0].border} bg-slate-800/80 p-5 ${MEDALS[0].glow} w-44`}
        >
          <FlagImg countryCode={top3[0]?.player.countryCode ?? ""} country={top3[0]?.player.country ?? ""} size={44} />
          <span className="text-sm font-black text-white text-center leading-tight">
            {top3[0]?.player.shortName}
          </span>
          <span className="text-[10px] text-slate-400">{top3[0]?.player.country}</span>
          <Medal className="w-5 h-5" style={{ color: MEDALS[0].color }} />
          <span className="text-3xl font-black tabular-nums" style={{ color: MEDALS[0].color }}>
            {top3[0]?.count}
          </span>
          <span className="text-[10px] text-slate-500">perfis</span>
        </motion.div>

        {/* Bronze — 3º */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
          className={`flex flex-col items-center gap-2 rounded-2xl border ${MEDALS[2].border} bg-slate-800/60 p-4 ${MEDALS[2].glow} w-36`}
        >
          <FlagImg countryCode={top3[2]?.player.countryCode ?? ""} country={top3[2]?.player.country ?? ""} size={36} />
          <span className="text-xs font-bold text-slate-300 text-center leading-tight">
            {top3[2]?.player.shortName}
          </span>
          <span className="text-[10px] text-slate-500">{top3[2]?.player.country}</span>
          <Medal className="w-4 h-4" style={{ color: MEDALS[2].color }} />
          <span className="text-lg font-black tabular-nums" style={{ color: MEDALS[2].color }}>
            {top3[2]?.count}
          </span>
          <span className="text-[10px] text-slate-500">perfis</span>
        </motion.div>
      </div>
    </div>
  )
}

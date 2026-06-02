"use client"

import { motion } from "framer-motion"
import { Trophy, Star, Zap } from "lucide-react"
import type { SimulationResult } from "@/lib/monte-carlo"
import { ATTRIBUTE_LABELS, flagUrl } from "@/lib/monte-carlo"

interface KpiCardsProps {
  result: SimulationResult
}

export function KpiCards({ result }: KpiCardsProps) {
  const leader = result.rankings[0]?.player

  const cards = [
    {
      icon: <Trophy className="w-5 h-5 text-amber-400" />,
      label: "Jogador Dominante",
      value: (
        <span className="flex items-center gap-3">
          <img
            src={flagUrl(leader?.countryCode ?? "")}
            alt={leader?.country ?? ""}
            width={40}
            height={30}
            className="rounded-sm object-cover shadow"
            style={{ width: 40, height: 28 }}
          />
          <span>{leader?.shortName}</span>
        </span>
      ),
      sub: `${result.rankings[0]?.count} perfis no top · ${leader?.country}`,
      textColor: "text-white",
    },
    {
      icon: <Star className="w-5 h-5 text-amber-400" />,
      label: "Rating Máximo Gerado",
      value: <span style={{ color: "#FBBF24" }}>{result.maxScore}</span>,
      sub: `${result.maxScorePlayer.shortName} — ${result.maxScorePlayer.country}`,
      textColor: "text-amber-400",
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      label: "Critério Mais Decisivo",
      value: <span className="text-white">{ATTRIBUTE_LABELS[result.topAttribute]}</span>,
      sub: "maior peso na função de aptidão",
      textColor: "text-white",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            {card.icon}
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
              {card.label}
            </span>
          </div>
          <div className={`text-4xl font-black leading-tight ${card.textColor}`}>
            {card.value}
          </div>
          <p className="text-xs text-slate-500">{card.sub}</p>
        </motion.div>
      ))}
    </div>
  )
}

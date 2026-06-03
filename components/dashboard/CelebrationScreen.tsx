"use client"

import { motion } from "framer-motion"
import type { PlayerProfile } from "@/lib/monte-carlo"
import { flagUrl } from "@/lib/monte-carlo"
import { PixelPlayer } from "@/components/dashboard/PixelPlayer"

interface CelebrationScreenProps {
  winner: PlayerProfile
}

export function CelebrationScreen({ winner }: CelebrationScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 overflow-hidden"
    >
      {/* Glow radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(251,191,36,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Sparks */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            x: Math.cos((i / 20) * Math.PI * 2) * (140 + Math.random() * 100),
            y: Math.sin((i / 20) * Math.PI * 2) * (140 + Math.random() * 100),
            scale: [0, 1.8, 0],
          }}
          transition={{ duration: 1.6, delay: 0.2 + i * 0.05, ease: "easeOut" }}
          className="absolute w-2 h-2 rounded-full bg-amber-400"
          style={{ top: "50%", left: "50%", marginLeft: -4, marginTop: -4 }}
        />
      ))}

      {/* Confetti-like colored particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`conf-${i}`}
          initial={{ opacity: 0, y: 0, x: 0, rotate: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            y: -(200 + Math.random() * 200),
            x: (Math.random() - 0.5) * 400,
            rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
            scale: [0, 1, 0.5, 0],
          }}
          transition={{ duration: 2.5, delay: 0.5 + i * 0.1, ease: "easeOut" }}
          className="absolute w-3 h-2 rounded-sm"
          style={{
            top: "55%",
            left: "50%",
            background: ["#FBBF24", "#22C55E", "#3B82F6", "#EF4444", "#A855F7", "#FB923C"][i % 6],
          }}
        />
      ))}

      <div className="relative flex flex-col items-center gap-6 text-center px-8">

        {/* Pixel players + título central */}
        <div className="flex items-end justify-center gap-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <PixelPlayer size="lg" speed={260} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, type: "spring", stiffness: 180, damping: 12 }}
            className="flex flex-col items-center gap-3"
          >
            <motion.span
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400/70"
            >
              10.000 cenários simulados
            </motion.span>

            <h1
              className="text-4xl md:text-5xl font-black tracking-tight leading-tight"
              style={{
                background: "linear-gradient(135deg, #FBBF24 0%, #FDE68A 50%, #F59E0B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              MAIOR VENCEDOR<br />DA BOLA DE OURO
            </h1>

            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="flex items-center gap-4 mt-2 bg-slate-800/60 border border-amber-400/30 rounded-2xl px-6 py-3"
            >
              <img
                src={flagUrl(winner.countryCode)}
                alt={winner.country}
                width={52}
                height={38}
                className="rounded object-cover shadow-lg"
                style={{ width: 52, height: 37 }}
              />
              <div className="flex flex-col items-start">
                <span className="text-3xl font-black text-white tracking-wide leading-tight">
                  {winner.name.toUpperCase()}
                </span>
                <span className="text-sm text-amber-400/80 font-semibold">{winner.country}</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <PixelPlayer size="lg" speed={300} />
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-slate-400 text-sm"
        >
          Jogador que venceu mais eleições nos 10.000 cenários Monte Carlo
        </motion.p>
      </div>
    </motion.div>
  )
}

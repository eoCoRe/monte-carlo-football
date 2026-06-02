"use client"

import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

export function LoadingOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-8 px-8 text-center max-w-md">
        {/* Pulsing gold orb */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 rounded-full bg-amber-400/20 border-2 border-amber-400/50 flex items-center justify-center"
        >
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </motion.div>

        {/* Skeleton bars */}
        <div className="w-full flex flex-col gap-3">
          {[100, 80, 90, 70, 85].map((w, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: [0.3, 0.8, 0.3], scaleX: 1 }}
              transition={{
                opacity: { duration: 1.2, repeat: Infinity, delay: i * 0.15 },
                scaleX: { duration: 0.4, delay: i * 0.1 },
              }}
              style={{ width: `${w}%` }}
              className="h-2.5 rounded-full bg-amber-400/30 origin-left"
            />
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <motion.p
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-amber-400 font-semibold text-lg tracking-wide"
          >
            Processando 10.000 perfis genéticos...
          </motion.p>
          <p className="text-slate-400 text-sm leading-relaxed">
            Calculando a probabilidade do craque ir pra balada na véspera da final...
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.25 }}
              className="w-2 h-2 rounded-full bg-amber-400"
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

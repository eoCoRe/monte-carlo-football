"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"

interface ChartExpandModalProps {
  title: string
  onClose: () => void
  children: React.ReactNode
}

export function ChartExpandModal({ title, onClose, children }: ChartExpandModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(2, 6, 23, 0.95)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="w-[95vw] h-[92vh] bg-slate-900 border border-slate-700/80 rounded-2xl flex flex-col overflow-hidden"
        style={{ boxShadow: "0 0 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(251,191,36,0.08)" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
          <h3
            className="text-base font-black uppercase tracking-widest"
            style={{
              background: "linear-gradient(135deg, #FBBF24 0%, #FDE68A 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors rounded-lg p-1.5 hover:bg-slate-800"
            title="Fechar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}

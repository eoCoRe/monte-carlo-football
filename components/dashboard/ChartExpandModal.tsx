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
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(2, 6, 23, 0.98)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.98, opacity: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="w-full h-full bg-slate-900 flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between px-10 py-6 border-b border-slate-700 shrink-0"
          style={{ background: "linear-gradient(to bottom, #0f172a, #0c1526)" }}>
          <h3
            className="text-3xl font-black uppercase tracking-widest"
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
            className="text-slate-400 hover:text-white transition-colors rounded-xl p-2.5 hover:bg-slate-800 border border-slate-700 hover:border-slate-500"
            title="Fechar (Esc)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* expand: fill height + scale up all text for presentation */}
        <style dangerouslySetInnerHTML={{ __html: `
          .chart-expand-body .recharts-responsive-container {
            height: calc(100vh - 110px) !important;
            min-height: 400px;
          }
          .chart-expand-body .recharts-cartesian-axis-tick text,
          .chart-expand-body .recharts-polar-angle-axis-tick text,
          .chart-expand-body .recharts-polar-radius-axis text {
            font-size: 15px !important;
            font-weight: 500 !important;
          }
          .chart-expand-body .recharts-legend-item-text {
            font-size: 15px !important;
          }
          .chart-expand-body .recharts-text.recharts-label {
            font-size: 15px !important;
          }
        `}} />
        <div className="chart-expand-body flex-1 overflow-auto px-10 py-8">
          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}

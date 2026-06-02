"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const COLORS: Record<string, string | null> = {
  _: null,
  S: "#F4C27F", // skin
  H: "#5C3D1E", // hair
  J: "#FBBF24", // jersey (ouro)
  Q: "#BFDBFE", // shorts (azul claro)
  L: "#F4C27F", // pernas
  B: "#1E293B", // chuteiras
  T: "#F59E0B", // troféu (dourado escuro)
  t: "#FDE68A", // troféu (dourado claro)
  g: "#FFFFFF", // bola branca
  k: "#1E293B", // bola preta
}

type C = keyof typeof COLORS

// Frame 1: segurando troféu na altura do peito, braços abaixados
const FRAME1: C[][] = [
  ["_","_","H","H","H","H","_","_"],
  ["_","H","S","S","S","S","H","_"],
  ["_","H","S","S","S","S","H","_"],
  ["_","_","S","S","S","S","_","_"],
  ["_","J","J","J","J","J","J","_"],
  ["J","J","J","J","J","J","J","J"],
  ["J","J","T","T","T","T","J","J"],
  ["_","J","T","t","t","T","J","_"],
  ["_","_","Q","Q","Q","Q","_","_"],
  ["_","_","Q","Q","Q","Q","_","_"],
  ["_","_","L","_","_","L","_","_"],
  ["_","_","L","_","_","L","_","_"],
  ["_","_","L","_","_","L","_","_"],
  ["_","B","B","_","_","B","B","_"],
  ["_","B","B","_","_","B","B","_"],
]

// Frame 2: braços levantados, troféu acima da cabeça
const FRAME2: C[][] = [
  ["_","_","T","T","T","T","_","_"],
  ["_","T","t","t","t","t","T","_"],
  ["T","_","_","H","H","_","_","T"],
  ["T","_","H","S","S","H","_","T"],
  ["T","_","H","S","S","H","_","T"],
  ["_","_","_","S","S","_","_","_"],
  ["_","_","J","J","J","J","_","_"],
  ["_","J","J","J","J","J","J","_"],
  ["_","_","Q","Q","Q","Q","_","_"],
  ["_","_","Q","Q","Q","Q","_","_"],
  ["_","_","L","_","_","L","_","_"],
  ["_","_","L","_","_","L","_","_"],
  ["_","_","L","_","_","L","_","_"],
  ["_","B","B","_","_","B","B","_"],
  ["_","B","B","_","_","B","B","_"],
]

// Frame 3: troféu bem alto, exultando
const FRAME3: C[][] = [
  ["_","T","t","T","T","t","T","_"],
  ["T","_","_","t","t","_","_","T"],
  ["T","_","_","H","H","_","_","T"],
  ["T","_","H","S","S","H","_","T"],
  ["_","_","H","S","S","H","_","_"],
  ["_","_","_","S","S","_","_","_"],
  ["_","_","J","J","J","J","_","_"],
  ["_","J","J","J","J","J","J","_"],
  ["_","_","Q","Q","Q","Q","_","_"],
  ["_","_","Q","Q","Q","Q","_","_"],
  ["_","_","L","_","_","L","_","_"],
  ["_","_","L","_","_","L","_","_"],
  ["_","_","L","_","_","L","_","_"],
  ["_","B","B","_","_","B","B","_"],
  ["_","B","B","_","_","B","B","_"],
]

const FRAMES = [FRAME1, FRAME2, FRAME3, FRAME2]

function PixelGrid({ frame, pixelSize }: { frame: C[][]; pixelSize: number }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(8, ${pixelSize}px)`,
        gridTemplateRows: `repeat(15, ${pixelSize}px)`,
        gap: Math.max(1, Math.floor(pixelSize / 6)),
        imageRendering: "pixelated",
      }}
    >
      {frame.flatMap((row, ri) =>
        row.map((cell, ci) => (
          <div
            key={`${ri}-${ci}`}
            style={{
              width: pixelSize,
              height: pixelSize,
              backgroundColor: COLORS[cell] ?? "transparent",
            }}
          />
        ))
      )}
    </div>
  )
}

interface PixelPlayerProps {
  size?: "sm" | "md" | "lg"
  speed?: number
}

const SIZE_MAP = { sm: 6, md: 9, lg: 14 }

export function PixelPlayer({ size = "sm", speed = 280 }: PixelPlayerProps) {
  const [frameIdx, setFrameIdx] = useState(0)
  const pixelSize = SIZE_MAP[size]

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIdx((prev) => (prev + 1) % FRAMES.length)
    }, speed)
    return () => clearInterval(interval)
  }, [speed])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="flex flex-col items-center gap-2"
      style={{ filter: "drop-shadow(0 0 12px rgba(251,191,36,0.5))" }}
    >
      <PixelGrid frame={FRAMES[frameIdx]} pixelSize={pixelSize} />
    </motion.div>
  )
}

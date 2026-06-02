"use client"

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts"
import type { SimulationResult } from "@/lib/monte-carlo"
import { flagUrl } from "@/lib/monte-carlo"

interface ScatterPlotProps {
  result: SimulationResult
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: { name: string; shortName: string; countryCode: string; x: number; y: number; color: string } }[]
}) => {
  if (active && payload?.length) {
    const d = payload[0].payload
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-2xl">
        <div className="flex items-center gap-2 mb-2">
          <img
            src={flagUrl(d.countryCode)}
            alt=""
            width={20}
            height={15}
            className="rounded-sm object-cover"
            style={{ width: 20, height: 14 }}
          />
          <p className="text-white font-bold text-sm">{d.name}</p>
        </div>
        <p className="text-xs text-slate-300">
          Sucesso coletivo (Sel.): <span className="text-amber-400 font-bold">{d.x}</span>
        </p>
        <p className="text-xs text-slate-300">
          Brilho individual: <span className="text-amber-400 font-bold">{d.y}</span>
        </p>
      </div>
    )
  }
  return null
}

const CustomDot = (props: {
  cx?: number
  cy?: number
  payload?: { color: string; shortName: string; countryCode: string }
}) => {
  const { cx, cy, payload } = props
  if (!cx || !cy || !payload) return null
  return (
    <g>
      <circle cx={cx} cy={cy} r={10} fill={payload.color} fillOpacity={0.85} />
      <circle cx={cx} cy={cy} r={10} fill="none" stroke={payload.color} strokeWidth={1.5} strokeOpacity={0.5} />
      <text
        x={cx}
        y={cy + 22}
        textAnchor="middle"
        fill="#cbd5e1"
        fontSize={9}
        fontWeight={600}
      >
        {payload.shortName}
      </text>
    </g>
  )
}

export function ScatterPlot({ result }: ScatterPlotProps) {
  return (
    <div className="w-full h-full flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">
          Mapa de Perfil — Individual vs. Coletivo
        </h3>
        <p className="text-[10px] text-slate-500 mt-0.5">
          Eixo X: média entre Copa Continental + Copa do Mundo (seleção) &bull; Eixo Y: média entre Gols + Títulos Individuais
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 20, right: 30, left: 0, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            type="number"
            dataKey="x"
            domain={[30, 100]}
            tick={{ fill: "#64748b", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          >
            <Label value="Sucesso Coletivo (Seleção)" position="insideBottom" offset={-18} fill="#475569" fontSize={11} />
          </XAxis>
          <YAxis
            type="number"
            dataKey="y"
            domain={[60, 100]}
            tick={{ fill: "#64748b", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={30}
          >
            <Label value="Brilho Individual" angle={-90} position="insideLeft" offset={12} fill="#475569" fontSize={11} />
          </YAxis>
          <Tooltip content={<CustomTooltip />} />
          <Scatter
            data={result.scatterData}
            shape={<CustomDot />}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

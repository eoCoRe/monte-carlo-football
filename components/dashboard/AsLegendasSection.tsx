"use client"

import { motion } from "framer-motion"

const LENDAS = [
  {
    pos: 1, name: "Caça Rato", apelido: "O Exterminador", flag: "🐀",
    perfis: 9999, score: 99.9, cor: "#FBBF24",
    stats: [
      { label: "Velocidade de fuga", val: 99 },
      { label: "Dribla gato", val: 100 },
      { label: "Gols no beco", val: 87 },
      { label: "Raça & garra", val: 100 },
    ],
    bio: "Nascido no campinho de areia, veterano de 14 peladas por semana. Nunca perdeu uma disputa de pênalti. Nunca.",
  },
  {
    pos: 2, name: "Deyerson", apelido: "Mágico do Bairro", flag: "🧙",
    perfis: 9876, score: 98.7, cor: "#22C55E",
    stats: [
      { label: "Chapéu por jogo", val: 94 },
      { label: "Finalizações no poste", val: 91 },
      { label: "Desculpas criativas", val: 100 },
      { label: "Chute de trivela", val: 88 },
    ],
    bio: "Diz que recusou proposta do Flamengo por causa da pizza de sábado. Atua como técnico, preparador e árbitro quando precisa.",
  },
  {
    pos: 3, name: "Lima Matador", apelido: "Terror dos Goleiros", flag: "⚔️",
    perfis: 9743, score: 97.4, cor: "#EF4444",
    stats: [
      { label: "Gols campeonato bairro", val: 42 },
      { label: "Faltas dadas", val: 99 },
      { label: "Reclamações c/ árbitro", val: 100 },
      { label: "Cabeceio sendo baixo", val: 85 },
    ],
    bio: "Artilheiro do Torneio do Sindicato desde 2008. Tem 3 troféus de isopor com spray dourado. Os mais importantes da carreira.",
  },
]

const MEDALS = ["🥇", "🥈", "🥉"]
const ORDER  = [1, 0, 2] // prata, ouro, bronze

export function AsLegendasSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="flex flex-col gap-4 bg-slate-800/30 border border-amber-400/20 rounded-2xl p-5"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">🐀</span>
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest">
            AS LENDAS DO BAIRRO — Edição Especial
          </h3>
          <p className="text-[10px] text-slate-500">
            Dados exclusivos do Campeonato do Campo de Areia · Metodologia Monte Carlo Adaptada
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-amber-400/5 border border-amber-400/20 rounded-xl px-4 py-2.5">
        <span>⚠️</span>
        <p className="text-[10px] text-amber-400/80 leading-relaxed">
          <strong>AVISO CIENTÍFICO:</strong> Os dados foram validados pelos próprios jogadores, que aprovaram unanimemente após a cerveja pós-jogo.
        </p>
      </div>

      {/* Pódio */}
      <div className="flex items-end gap-4 justify-center flex-wrap">
        {ORDER.map((idx) => {
          const l = LENDAS[idx]
          const isFirst = idx === 0
          return (
            <motion.div
              key={l.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex flex-col items-center gap-2 rounded-2xl border bg-slate-800/60 p-4 ${
                isFirst ? "w-48 pt-5" : "w-40"
              }`}
              style={{ borderColor: `${l.cor}50`, boxShadow: isFirst ? `0 0 20px ${l.cor}25` : undefined }}
            >
              <span className={isFirst ? "text-5xl" : "text-4xl"}>{l.flag}</span>
              <span className={`font-black text-center leading-tight ${isFirst ? "text-base text-white" : "text-sm text-slate-200"}`}>
                {l.name}
              </span>
              <span className="text-[9px] text-slate-500 italic text-center">{l.apelido}</span>
              <span className={isFirst ? "text-3xl" : "text-2xl"}>{MEDALS[l.pos - 1]}</span>
              <span className={`font-black tabular-nums ${isFirst ? "text-2xl" : "text-lg"}`} style={{ color: l.cor }}>
                {l.perfis.toLocaleString("pt-BR")}
              </span>
              <span className="text-[9px] text-slate-600">perfis</span>
              <div className="flex flex-col gap-1 w-full mt-1 border-t border-slate-700/60 pt-2">
                {l.stats.map(s => (
                  <div key={s.label} className="flex justify-between text-[9px]">
                    <span className="text-slate-500 truncate">{s.label}</span>
                    <span className="font-black ml-1" style={{ color: l.cor }}>{s.val}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Bios */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {LENDAS.map((l) => (
          <div key={l.name} className="rounded-xl border border-slate-700/40 bg-slate-800/20 p-3"
            style={{ borderColor: `${l.cor}20` }}>
            <p className="text-[10px] font-bold mb-1" style={{ color: l.cor }}>
              {MEDALS[l.pos - 1]} {l.name}
            </p>
            <p className="text-[10px] text-slate-400 leading-relaxed italic">"{l.bio}"</p>
          </div>
        ))}
      </div>

      <p className="text-center text-[9px] text-slate-700 italic">
        * Nenhum Bola de Ouro oficial foi consultado. Os dados são 100% verídicos segundo os próprios jogadores.
      </p>
    </motion.div>
  )
}

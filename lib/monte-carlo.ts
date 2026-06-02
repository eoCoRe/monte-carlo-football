export interface Weights {
  gols: number
  titulosIndividuais: number
  ligaNacional: number
  copaNacional: number
  copaContinentalClubes: number
  mundialClubes: number
  copaContinentalSelecao: number
  copaMundo: number
}

export interface PlayerProfile {
  name: string
  shortName: string
  code: string
  country: string
  countryCode: string
  color: string
  baseAttributes: Weights
  variance: number
}

export function flagUrl(countryCode: string): string {
  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`
}

const p = (
  name: string, shortName: string, code: string,
  country: string, countryCode: string, color: string,
  g: number, ti: number, ln: number, cn: number,
  ccl: number, mc: number, ccs: number, cm: number,
  variance: number
): PlayerProfile => ({
  name, shortName, code, country, countryCode, color,
  baseAttributes: { gols: g, titulosIndividuais: ti, ligaNacional: ln, copaNacional: cn,
    copaContinentalClubes: ccl, mundialClubes: mc, copaContinentalSelecao: ccs, copaMundo: cm },
  variance,
})

// Jogadores especiais — modo AS Lendas (stats 100 em tudo)
export const LENDAS_PLAYERS: PlayerProfile[] = [
  p("Caça Rato",    "Caça Rato",    "CACAATO",     "Campo de Areia","br","#FBBF24", 100,100,100,100,100,100,100,100, 1),
  p("Deyerson",     "Deyerson",     "DEYERSON",    "Campo de Areia","br","#22C55E", 100,100,100,100,100,100,100,100, 1),
  p("Lima Matador", "Lima Matador", "LIMAMATADOR", "Campo de Areia","br","#EF4444", 100,100,100,100,100,100,100,100, 1),
]

// ─────────────────────────────────────────────────────────────────────────────
// Jogadores atuais/recentes — stats baseadas em conquistas reais 2018-2025
// Escala 0-100 por categoria
// ─────────────────────────────────────────────────────────────────────────────
export const PLAYERS: PlayerProfile[] = [

  // ── ARGENTINA ──────────────────────────────────────────────────────────────
  // Messi: 8 Ballon d'Or, WC2022, Copa América 2021, UCL 4x Barça, La Liga 10x
  p("Lionel Messi",     "Messi",       "MESSI",    "Argentina","ar","#38BDF8",
    95, 99, 88, 85, 94, 82, 92, 95,  8),

  // Maradona removido — não é atual

  // Julian Álvarez: WC 2022 (golden boot+), Copa América 2024, UCL 2023
  p("Julian Álvarez",  "J. Álvarez",  "JALVAREZ", "Argentina","ar","#60A5FA",
    78, 70, 84, 78, 84, 74, 88, 90,  10),

  // Enzo Fernández: WC 2022, Copa América 2024, UCL (faltou ganhá-la)
  p("Enzo Fernández",  "E. Fernández","ENZO",     "Argentina","ar","#93C5FD",
    66, 64, 74, 68, 66, 58, 88, 90,  12),

  // Alexis Mac Allister: WC 2022, Copa América 2024, PL com Liverpool
  p("Alexis Mac Allister","Mac Allister","MACALLISTER","Argentina","ar","#0EA5E9",
    64, 64, 80, 72, 70, 62, 88, 90,  11),

  // ── BRASIL ─────────────────────────────────────────────────────────────────
  // Vinicius Jr: UCL 2022+2024, La Liga 2x, Copa América 2024 runner-up
  p("Vinicius Jr",     "Vini Jr",     "VINIJR",   "Brasil","br","#22C55E",
    80, 78, 88, 74, 92, 82, 76, 64,  12),

  // Neymar: UCL 2015, Copa América 2019, La Liga+Copa del Rey+Ligue 1
  p("Neymar Jr",       "Neymar",      "NEYMAR",   "Brasil","br","#4ADE80",
    86, 74, 82, 80, 82, 72, 82, 68,  14),

  // Alisson: UCL 2019, PL 2020, Copa América 2019
  p("Alisson Becker",  "Alisson",     "ALISSON",  "Brasil","br","#86EFAC",
    12, 74, 82, 72, 82, 72, 78, 60,  8),

  // Raphinha: La Liga, Copa América runner-up 2024
  p("Raphinha",        "Raphinha",    "RAPHINHA",  "Brasil","br","#16A34A",
    72, 62, 82, 72, 72, 62, 74, 62,  12),

  // ── ESPANHA ────────────────────────────────────────────────────────────────
  // Rodri: Ballon d'Or 2024, UCL 2023, Euro 2024, Nations League x2, PL 4x
  p("Rodri",           "Rodri",       "RODRI",    "Espanha","es","#FBBF24",
    60, 84, 90, 82, 84, 74, 92, 62,  7),

  // Lamine Yamal: Euro 2024 (melhor jovem + gol na final), La Liga
  p("Lamine Yamal",    "Yamal",       "YAMAL",    "Espanha","es","#FDE68A",
    78, 68, 82, 72, 74, 62, 90, 56,  14),

  // Gavi: Euro 2024, Nations League 2021+2023, La Liga 2x, Copa del Rey
  p("Gavi",            "Gavi",        "GAVI",     "Espanha","es","#F97316",
    64, 68, 84, 76, 72, 62, 90, 58,  12),

  // Pedri: Euro 2024, Nations League, La Liga, Golden Boy 2021
  p("Pedri",           "Pedri",       "PEDRI",    "Espanha","es","#FB923C",
    66, 68, 84, 76, 74, 64, 90, 58,  12),

  // Dani Carvajal: UCL 5x, La Liga 5x+, Euro 2024, WC 2010 (não é atual mas ganhou Euro 2024)
  p("Dani Carvajal",   "Carvajal",    "CARVAJAL", "Espanha","es","#C2410C",
    42, 70, 88, 80, 92, 82, 90, 62,  8),

  // ── PORTUGAL ───────────────────────────────────────────────────────────────
  // CR7: 5 Ballon d'Or, Euro 2016, Nations League 2019, UCL 5x, gols all-time
  p("Cristiano Ronaldo","CR7",         "CR7",      "Portugal","pt","#DC2626",
    97, 90, 90, 82, 92, 84, 78, 62,  7),

  // Bernardo Silva: UCL 2023, PL 4x, Nations League 2019, Euro 2024 semi
  p("Bernardo Silva",  "B. Silva",    "BSILVA",   "Portugal","pt","#EF4444",
    70, 72, 90, 80, 84, 74, 76, 62,  9),

  // Bruno Fernandes: Nations League 2019, 2024/25 Liga (Man United sem UCL)
  p("Bruno Fernandes", "B. Fernandes","BFERNANDES","Portugal","pt","#F87171",
    74, 68, 74, 72, 66, 56, 74, 62,  11),

  // Rúben Dias: UCL 2023, PL 4x, Nations League 2019
  p("Rúben Dias",      "R. Dias",     "RDIAS",    "Portugal","pt","#B91C1C",
    30, 74, 90, 80, 84, 74, 74, 62,  8),

  // João Félix: Copa del Rey, ucl (pouco), Euro 2024 semi
  p("João Félix",      "J. Félix",    "JOAOFELIX","Portugal","pt","#991B1B",
    74, 68, 78, 72, 74, 64, 74, 60,  13),

  // ── FRANCE ─────────────────────────────────────────────────────────────────
  // Mbappé: WC 2018, Nations League 2021, Ligue 1 6x, La Liga (Real)
  p("Kylian Mbappé",   "Mbappé",      "MBAPPE",   "França","fr","#3B82F6",
    90, 76, 82, 74, 72, 66, 78, 90,  10),

  // Benzema: Ballon d'Or 2022, UCL 5x, La Liga 5x+, WC2022 lesionado saiu cedo
  p("Karim Benzema",   "Benzema",     "BENZEMA",  "França","fr","#6366F1",
    88, 84, 90, 80, 92, 84, 68, 68,  9),

  // Griezmann: WC 2018, Euro 2016 finalista, La Liga+UEFA Europa League
  p("Antoine Griezmann","Griezmann",  "GRIEZMANN","França","fr","#8B5CF6",
    78, 70, 80, 74, 72, 64, 76, 85,  10),

  // Tchouaméni: UCL 2022+2024, La Liga, WC 2022 finalista
  p("Aurélien Tchouaméni","Tchouaméni","TCHOU",   "França","fr","#A855F7",
    58, 64, 88, 78, 90, 78, 72, 82,  12),

  // Kolo Muani: WC 2022 finalista, Bundesliga+UCL (Frankfurt), Ligue 1 (PSG)
  p("Randal Kolo Muani","Kolo Muani", "KOLOMUANI","França","fr","#7C3AED",
    72, 62, 82, 72, 68, 60, 72, 82,  13),

  // William Saliba: PL runner-up Arsenal, WC 2022 finalista
  p("William Saliba",  "Saliba",      "SALIBA",   "França","fr","#4F46E5",
    30, 62, 78, 72, 66, 58, 72, 82,  10),

  // ── ALEMANHA ───────────────────────────────────────────────────────────────
  // Kroos: WC 2014, UCL 4x (2016-18+2022), La Liga 4x, aposentou após Euro 2024
  p("Toni Kroos",      "Kroos",       "KROOS",    "Alemanha","de","#A3A3A3",
    60, 74, 90, 80, 90, 82, 64, 90,  7),

  // Kimmich: UCL 2020, Bundesliga 8x, DFB-Pokal 3x, Nations League semi
  p("Joshua Kimmich",  "Kimmich",     "KIMMICH",  "Alemanha","de","#71717A",
    62, 70, 88, 80, 84, 76, 66, 54,  8),

  // Musiala: Bundesliga 3x+, Euro 2024 semi-finalista
  p("Jamal Musiala",   "Musiala",     "MUSIALA",  "Alemanha","de","#D4D4D8",
    76, 68, 84, 76, 78, 68, 72, 60,  12),

  // Wirtz: Bundesliga 2024 com Leverkusen (invicto), Euro 2024 semi
  p("Florian Wirtz",   "Wirtz",       "WIRTZ",    "Alemanha","de","#E5E7EB",
    78, 66, 84, 76, 74, 66, 72, 60,  13),

  // T. Müller: UCL 2020, Bundesliga 10x+, WC 2014, aposentou 2025
  p("Thomas Müller",   "T. Müller",   "TMULLER",  "Alemanha","de","#9CA3AF",
    76, 72, 86, 80, 84, 76, 68, 90,  9),

  // ── HOLANDA ────────────────────────────────────────────────────────────────
  // Van Dijk: UCL 2019, PL 2020, Euro 2024 finalista (HOL)
  p("Virgil van Dijk",  "Van Dijk",   "VANDIJK",  "Holanda","nl","#F97316",
    58, 72, 82, 72, 82, 70, 74, 64,  8),

  // Gakpo: PL com Liverpool, Euro 2024 finalista, WC 2022 semi
  p("Cody Gakpo",      "Gakpo",       "GAKPO",    "Holanda","nl","#FB923C",
    74, 62, 78, 70, 74, 62, 74, 64,  12),

  // ── BÉLGICA ────────────────────────────────────────────────────────────────
  // De Bruyne: PL 6x, UCL 2023, FA Cup 2023, múltiplos prêmios individuais
  p("Kevin De Bruyne", "De Bruyne",   "DEBRUYNE", "Bélgica","be","#60A5FA",
    72, 78, 90, 80, 84, 74, 62, 62,  8),

  // Courtois: UCL 2022+2024, La Liga 3x+, Euro 2024 semi (inj)
  p("Thibaut Courtois","Courtois",    "COURTOIS", "Bélgica","be","#93C5FD",
    10, 74, 88, 78, 92, 82, 62, 62,  7),

  // ── NORUEGA ────────────────────────────────────────────────────────────────
  // Haaland: UCL 2023, PL 2x, FA Cup 2023, recorde absoluto PL gols (36)
  p("Erling Haaland",  "Haaland",     "HAALAND",  "Noruega","no","#F59E0B",
    95, 70, 84, 72, 82, 72, 44, 36,  11),

  // ── POLÔNIA ────────────────────────────────────────────────────────────────
  // Lewandowski: UCL 2020, Bundesliga 8x, La Liga 1x, FIFA Best 2020/21
  p("Robert Lewandowski","Lewandowski","LEWAND",  "Polônia","pl","#CBD5E1",
    94, 78, 88, 82, 82, 74, 56, 52,  8),

  // ── CROÁCIA ────────────────────────────────────────────────────────────────
  // Modrić: Ballon d'Or 2018, UCL 4x Real, La Liga 5x, WC2018 finalista, WC2022 3°
  p("Luka Modrić",     "Modrić",      "MODRIC",   "Croácia","hr","#E11D48",
    62, 84, 90, 80, 92, 82, 62, 76,  8),

  // ── SENEGAL ────────────────────────────────────────────────────────────────
  // Mané: UCL 2019, PL 2020, AFCON 2021, Bundesliga/Saudi
  p("Sadio Mané",      "Mané",        "MANE",     "Senegal","sn","#22C55E",
    82, 70, 80, 72, 82, 70, 74, 46,  10),

  // ── EGITO ──────────────────────────────────────────────────────────────────
  // Salah: UCL 2019, PL 2020, FA Cup+League Cup, PL artilheiro múltiplas vezes
  p("Mohamed Salah",   "Salah",       "SALAH",    "Egito","eg","#F97316",
    90, 74, 84, 78, 82, 72, 52, 46,  10),

  // ── MARROCOS ───────────────────────────────────────────────────────────────
  // Hakimi: UCL 2020 (Inter), Ligue 1 3x, Inter-Milão Série A, WC2022 semi (Marrocos hist.)
  p("Achraf Hakimi",   "Hakimi",      "HAKIMI",   "Marrocos","ma","#DC2626",
    62, 68, 82, 74, 82, 72, 68, 62,  11),

  // ── URUGUAI ────────────────────────────────────────────────────────────────
  // Valverde: UCL 2022+2024, La Liga 3x, Copa América 2024 runner-up
  p("Federico Valverde","Valverde",   "VALVERDE", "Uruguai","uy","#60A5FA",
    68, 66, 88, 78, 92, 82, 62, 56,  8),

  // Darwin Núñez: UCL 2019 (não jogou), limited titles with Liverpool so far
  p("Darwin Núñez",    "D. Núñez",    "DARWINNUNEZ","Uruguai","uy","#93C5FD",
    76, 62, 74, 68, 72, 62, 62, 56,  13),

  // ── ENGLAND ────────────────────────────────────────────────────────────────
  // Bellingham: UCL 2024, La Liga, Euro 2024 finalista, Golden Boy 2023
  p("Jude Bellingham", "Bellingham",  "BELLINGHAM","Inglaterra","gb-eng","#EF4444",
    74, 72, 86, 74, 88, 78, 62, 58,  12),

  // Foden: UCL 2023, PL 4x, FWA+PL Player Year 2024, FA Cup 2023
  p("Phil Foden",      "Foden",       "FODEN",    "Inglaterra","gb-eng","#DC2626",
    76, 72, 88, 78, 84, 74, 62, 58,  11),

  // Saka: FA Cup, PL runner-up Arsenal, Euro 2024 finalista
  p("Bukayo Saka",     "Saka",        "SAKA",     "Inglaterra","gb-eng","#B91C1C",
    74, 68, 80, 80, 70, 62, 62, 58,  12),

  // Kane: PL artilheiro all-time, Bundesliga, sem títulos equipe (nenhum UCL ou PL)
  p("Harry Kane",      "Kane",        "KANE",     "Inglaterra","gb-eng","#9F1239",
    92, 68, 80, 68, 70, 62, 60, 60,  10),

  // Trent Alexander-Arnold: UCL 2019, PL 2020, moveu para Real Madrid 2025
  p("Trent Alexander-Arnold","Trent","TRENT",    "Inglaterra","gb-eng","#881337",
    54, 68, 82, 72, 82, 72, 60, 58,  10),

  // ── GEÓRGIA ────────────────────────────────────────────────────────────────
  // Kvaratskhelia: Série A 2023 (Napoli histórico), Ligue 1 com PSG
  p("Khvicha Kvaratskhelia","Kvaratskhelia","KVARA","Geórgia","ge","#DC2626",
    74, 64, 76, 70, 72, 62, 52, 40,  13),

  // ── ITÁLIA ─────────────────────────────────────────────────────────────────
  // Chiesa: Euro 2020 winner, Série A (não ganhou UCL)
  p("Federico Chiesa", "Chiesa",      "CHIESA",   "Itália","it","#3B82F6",
    72, 64, 78, 72, 68, 60, 78, 62,  13),

  // ── SÉRVIA ─────────────────────────────────────────────────────────────────
  // Vlahović: Série A, UCL (Juventus — não ganhou)
  p("Dušan Vlahović",  "Vlahović",    "VLAHOVIC", "Sérvia","rs","#DC2626",
    82, 62, 76, 70, 68, 60, 54, 48,  12),

  // ── PORTUGAL (continuação) ─────────────────────────────────────────────────
  // Rafael Leão: Série A 2022 (Milan), Euro 2024 semi
  p("Rafael Leão",     "R. Leão",     "RLEAO",    "Portugal","pt","#FB923C",
    74, 64, 76, 70, 70, 62, 74, 60,  13),

  // ── AUSTRÁLIA ──────────────────────────────────────────────────────────────
  // Sam Kerr — aqui o usuário quis jogadores masculinos claramente, skip

]

function gaussianRandom(mean: number, stdDev: number): number {
  let u = 0, v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  const n = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  return Math.max(0, Math.min(100, mean + n * stdDev))
}

export interface ScatterPoint {
  x: number; y: number; name: string; shortName: string
  countryCode: string; color: string; code: string
}

export interface RegionSlice {
  name: string; value: number; color: string; players: string[]
}

export interface SimulationResult {
  rankings: { player: PlayerProfile; count: number; avgScore: number; avgAttributes: Weights }[]
  maxScore: number
  maxScorePlayer: PlayerProfile
  topAttribute: keyof Weights
  distributionData: { score: number; [key: string]: number }[]
  histogramData: { bucket: number; label: string; [key: string]: number | string }[]
  convergenceData: { iteration: number; [key: string]: number }[]
  scatterData: ScatterPoint[]
  regionData: RegionSlice[]
}

const HIST_MIN = 70
const HIST_BUCKET_SIZE = 2
const HIST_COUNT = 16

export function runMonteCarlo(weights: Weights, totalProfiles = 10000, extraPlayers: PlayerProfile[] = []): SimulationResult {
  const allPlayers = [...PLAYERS, ...extraPlayers]
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0) || 1

  const playerCounts: Record<string, number> = {}
  const playerScores: Record<string, number[]> = {}
  const playerAttributes: Record<string, Weights[]> = {}
  const histRaw: Record<string, number[]> = {}

  allPlayers.forEach((pl) => {
    playerCounts[pl.code] = 0
    playerScores[pl.code] = []
    playerAttributes[pl.code] = []
    histRaw[pl.code] = new Array(HIST_COUNT).fill(0)
  })

  let globalMaxScore = 0
  let globalMaxPlayer = allPlayers[0]
  const convergenceData: { iteration: number; [key: string]: number }[] = []

  for (let i = 0; i < totalProfiles; i++) {
    const player = allPlayers[Math.floor(Math.random() * allPlayers.length)]
    const attrs: Weights = {
      gols:                   gaussianRandom(player.baseAttributes.gols, player.variance),
      titulosIndividuais:     gaussianRandom(player.baseAttributes.titulosIndividuais, player.variance),
      ligaNacional:           gaussianRandom(player.baseAttributes.ligaNacional, player.variance),
      copaNacional:           gaussianRandom(player.baseAttributes.copaNacional, player.variance),
      copaContinentalClubes:  gaussianRandom(player.baseAttributes.copaContinentalClubes, player.variance),
      mundialClubes:          gaussianRandom(player.baseAttributes.mundialClubes, player.variance),
      copaContinentalSelecao: gaussianRandom(player.baseAttributes.copaContinentalSelecao, player.variance),
      copaMundo:              gaussianRandom(player.baseAttributes.copaMundo, player.variance),
    }

    const score = (
      weights.gols * attrs.gols +
      weights.titulosIndividuais * attrs.titulosIndividuais +
      weights.ligaNacional * attrs.ligaNacional +
      weights.copaNacional * attrs.copaNacional +
      weights.copaContinentalClubes * attrs.copaContinentalClubes +
      weights.mundialClubes * attrs.mundialClubes +
      weights.copaContinentalSelecao * attrs.copaContinentalSelecao +
      weights.copaMundo * attrs.copaMundo
    ) / totalWeight

    if (score >= 62) {
      playerCounts[player.code]++
      playerScores[player.code].push(score)
      playerAttributes[player.code].push(attrs)
      if (score > globalMaxScore) { globalMaxScore = score; globalMaxPlayer = player }
      const bi = Math.min(HIST_COUNT - 1, Math.floor((score - HIST_MIN) / HIST_BUCKET_SIZE))
      if (bi >= 0) histRaw[player.code][bi]++
    }

    if ((i + 1) % 500 === 0) {
      const entry: { iteration: number; [key: string]: number } = { iteration: i + 1 }
      allPlayers.forEach((pl) => { entry[pl.code] = playerCounts[pl.code] })
      convergenceData.push(entry)
    }
  }

  const rankings = allPlayers.map((player) => {
    const scores = playerScores[player.code]
    const attrs  = playerAttributes[player.code]
    const avgScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
    const avg = (key: keyof Weights) =>
      attrs.length ? attrs.reduce((s, a) => s + a[key], 0) / attrs.length : player.baseAttributes[key]
    return {
      player, count: playerCounts[player.code], avgScore,
      avgAttributes: {
        gols: avg("gols"), titulosIndividuais: avg("titulosIndividuais"),
        ligaNacional: avg("ligaNacional"), copaNacional: avg("copaNacional"),
        copaContinentalClubes: avg("copaContinentalClubes"), mundialClubes: avg("mundialClubes"),
        copaContinentalSelecao: avg("copaContinentalSelecao"), copaMundo: avg("copaMundo"),
      },
    }
  }).sort((a, b) => b.count - a.count)

  const weightKeys = Object.keys(weights) as (keyof Weights)[]
  const topAttribute = weightKeys.reduce((best, key) => weights[key] > weights[best] ? key : best)

  const top3 = rankings.slice(0, 3)
  const distributionData: { score: number; [key: string]: number }[] = []
  for (let b = 0; b <= 60; b++) {
    const s = 55 + (b / 60) * 40
    const entry: { score: number; [key: string]: number } = { score: Math.round(s * 10) / 10 }
    top3.forEach((r) => {
      const g = (1 / (r.player.variance * Math.sqrt(2 * Math.PI))) *
        Math.exp(-0.5 * ((s - r.avgScore) / r.player.variance) ** 2)
      entry[r.player.code] = Math.round(g * 10000) / 10000
    })
    distributionData.push(entry)
  }

  const histogramData = Array.from({ length: HIST_COUNT }, (_, bi) => {
    const bucketScore = HIST_MIN + bi * HIST_BUCKET_SIZE
    const entry: { bucket: number; label: string; [key: string]: number | string } = {
      bucket: bucketScore, label: `${bucketScore}`,
    }
    allPlayers.forEach((pl) => { entry[pl.code] = histRaw[pl.code][bi] })
    return entry
  })

  const scatterData: ScatterPoint[] = allPlayers.map((player) => ({
    x: Math.round(((player.baseAttributes.copaMundo + player.baseAttributes.copaContinentalSelecao) / 2) * 10) / 10,
    y: Math.round(((player.baseAttributes.gols + player.baseAttributes.titulosIndividuais) / 2) * 10) / 10,
    name: player.name, shortName: player.shortName,
    countryCode: player.countryCode, color: player.color, code: player.code,
  }))

  const sulAm = new Set(["MESSI","JALVAREZ","ENZO","MACALLISTER","VINIJR","NEYMAR","ALISSON","RAPHINHA","VALVERDE","DARWINNUNEZ"])
  const regionData: RegionSlice[] = [
    { name: "UEFA (Europa)", color: "#3B82F6", value: 0, players: [] },
    { name: "América do Sul", color: "#22C55E", value: 0, players: [] },
    { name: "Outros", color: "#F97316", value: 0, players: [] },
  ]
  allPlayers.forEach(pl => {
    const cnt = playerCounts[pl.code] || 0
    if (sulAm.has(pl.code) || pl.countryCode === "br") { regionData[1].value += cnt; regionData[1].players.push(pl.code) }
    else if (["sn","eg","ma"].includes(pl.countryCode)) { regionData[2].value += cnt; regionData[2].players.push(pl.code) }
    else { regionData[0].value += cnt; regionData[0].players.push(pl.code) }
  })

  return {
    rankings, maxScore: Math.round(globalMaxScore * 10) / 10, maxScorePlayer: globalMaxPlayer,
    topAttribute, distributionData, histogramData, convergenceData, scatterData, regionData,
  }
}

export const ATTRIBUTE_LABELS: Record<keyof Weights, string> = {
  gols: "Gols", titulosIndividuais: "Títulos Individuais",
  ligaNacional: "Liga Nacional", copaNacional: "Copa Nacional",
  copaContinentalClubes: "Copa Continental (Clube)", mundialClubes: "Mundial de Clubes",
  copaContinentalSelecao: "Copa Continental (Seleção)", copaMundo: "Copa do Mundo",
}

export const ATTRIBUTE_LABELS_SHORT: Record<keyof Weights, string> = {
  gols: "Gols", titulosIndividuais: "T. Individuais",
  ligaNacional: "Liga Nac.", copaNacional: "Copa Nac.",
  copaContinentalClubes: "Copa Cont. Clube", mundialClubes: "Mundial Clubes",
  copaContinentalSelecao: "Copa Cont. Sel.", copaMundo: "Copa do Mundo",
}

export const GLOBAL_AVERAGES: Weights = {
  gols: 70, titulosIndividuais: 70, ligaNacional: 81,
  copaNacional: 74, copaContinentalClubes: 78, mundialClubes: 70,
  copaContinentalSelecao: 70, copaMundo: 63,
}

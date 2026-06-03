export interface Weights {
  gols: number
  assistencias: number
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
  position: string
  country: string
  countryCode: string
  color: string
  baseAttributes: Weights
  variance: number
}

export function flagUrl(countryCode: string): string {
  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`
}

// position codes: ST=Striker, WF=Winger/Forward, CAM=Attacking Mid,
// CM=Central Mid, DM=Defensive Mid, CB=Centre-Back, FB=Full-Back, GK=Goalkeeper
const p = (
  name: string, shortName: string, code: string, pos: string,
  country: string, countryCode: string, color: string,
  g: number, ast: number, ti: number, ln: number, cn: number,
  ccl: number, mc: number, ccs: number, cm: number,
  variance: number
): PlayerProfile => ({
  name, shortName, code, position: pos, country, countryCode, color,
  baseAttributes: {
    gols: g, assistencias: ast, titulosIndividuais: ti,
    ligaNacional: ln, copaNacional: cn,
    copaContinentalClubes: ccl, mundialClubes: mc,
    copaContinentalSelecao: ccs, copaMundo: cm,
  },
  variance,
})

// ─────────────────────────────────────────────────────────────────────────────
// Stats baseadas em conquistas reais 2018-2025. Escala 0-100 por categoria.
//
// gols: normalizado contra Haaland (36 gols em 1 temporada de PL = topo absoluto)
//   Meias e zagueiros têm valores baixos propositalmente — reflete a realidade.
//
// assistencias: normalizado contra De Bruyne (recordista de assistências na PL)
//   Atacantes puros como Haaland têm valores baixos.
// ─────────────────────────────────────────────────────────────────────────────
export const PLAYERS: PlayerProfile[] = [

  // ── ARGENTINA ──────────────────────────────────────────────────────────────
  // Messi: 8 Ballon d'Or, WC2022, Copa América 2021+2024, UCL 4x, La Liga 10x
  p("Lionel Messi",      "Messi",        "MESSI",      "CAM","Argentina","ar","#38BDF8",
    80, 92, 99, 88, 85, 94, 82, 92, 95, 8),

  // Julián Álvarez: artilheiro WC2022, Copa América 2024, UCL 2023
  p("Julián Álvarez",    "J. Álvarez",   "JALVAREZ",   "ST","Argentina","ar","#60A5FA",
    72, 66, 70, 84, 78, 84, 74, 88, 90, 10),

  // Enzo Fernández: WC2022, Copa América 2024, UCL finalist
  p("Enzo Fernández",    "E. Fernández", "ENZO",       "CM","Argentina","ar","#93C5FD",
    42, 68, 64, 74, 68, 66, 58, 88, 90, 12),

  // Mac Allister: WC2022, Copa América 2024, PL com Liverpool
  p("Alexis Mac Allister","Mac Allister","MACALLISTER","CM","Argentina","ar","#0EA5E9",
    40, 60, 64, 80, 72, 70, 62, 88, 90, 11),

  // ── BRASIL ─────────────────────────────────────────────────────────────────
  // Vinicius Jr: UCL 2022+2024, La Liga 2x, Copa América 2024 runner-up
  p("Vinicius Jr",       "Vini Jr",      "VINIJR",     "WF","Brasil","br","#22C55E",
    65, 72, 78, 88, 74, 92, 82, 76, 64, 12),

  // Neymar: UCL 2015, Copa América 2019, La Liga+Ligue 1 (muitas lesões recentes)
  p("Neymar Jr",         "Neymar",       "NEYMAR",     "WF","Brasil","br","#4ADE80",
    66, 84, 74, 82, 80, 82, 72, 82, 68, 16),

  // Alisson: UCL 2019, PL 2020, Copa América 2019 — goleiro não marca gols
  p("Alisson Becker",    "Alisson",      "ALISSON",    "GK","Brasil","br","#86EFAC",
    5,  12, 74, 82, 72, 82, 72, 78, 60, 8),

  // Raphinha: La Liga+UCL 2024/25, Copa América runner-up 2024
  p("Raphinha",          "Raphinha",     "RAPHINHA",   "WF","Brasil","br","#16A34A",
    66, 68, 62, 82, 72, 72, 62, 74, 62, 12),

  // ── ESPANHA ────────────────────────────────────────────────────────────────
  // Rodri: Ballon d'Or 2024, UCL 2023, Euro 2024, Nations League 2x, PL 4x
  p("Rodri",             "Rodri",        "RODRI",      "DM","Espanha","es","#FBBF24",
    20, 52, 84, 90, 82, 84, 74, 92, 62, 7),

  // Lamine Yamal: 17 anos, Euro 2024 (gol na final), La Liga 2025
  p("Lamine Yamal",      "Yamal",        "YAMAL",      "WF","Espanha","es","#FDE68A",
    68, 76, 68, 82, 72, 74, 62, 90, 56, 14),

  // Gavi: Euro 2024, Nations League 2021+2023, La Liga 2x
  p("Gavi",              "Gavi",         "GAVI",       "CM","Espanha","es","#F97316",
    25, 72, 68, 84, 76, 72, 62, 90, 58, 12),

  // Pedri: Euro 2024, Nations League, La Liga, Golden Boy 2021 — meia criativo
  p("Pedri",             "Pedri",        "PEDRI",      "CM","Espanha","es","#FB923C",
    28, 80, 68, 84, 76, 74, 64, 90, 58, 12),

  // Carvajal: UCL 5x, La Liga 5x, Euro 2024, Ballon d'Or candidato 2024
  p("Dani Carvajal",     "Carvajal",     "CARVAJAL",   "FB","Espanha","es","#C2410C",
    22, 54, 70, 88, 80, 92, 82, 90, 62, 8),

  // ── PORTUGAL ───────────────────────────────────────────────────────────────
  // CR7: 5 Ballon d'Or, Euro 2016, Nations League 2019, UCL 5x, 900+ gols carreira
  p("Cristiano Ronaldo", "CR7",          "CR7",        "ST","Portugal","pt","#DC2626",
    92, 50, 90, 90, 82, 92, 84, 78, 62, 7),

  // Bernardo Silva: UCL 2023, PL 4x, Nations League 2019
  p("Bernardo Silva",    "B. Silva",     "BSILVA",     "CM","Portugal","pt","#EF4444",
    50, 78, 72, 90, 80, 84, 74, 76, 62, 9),

  // Bruno Fernandes: Nations League 2019+2025, PL (Man United)
  p("Bruno Fernandes",   "B. Fernandes", "BFERNANDES",  "CAM","Portugal","pt","#F87171",
    68, 74, 68, 74, 72, 66, 56, 74, 62, 11),

  // Rúben Dias: UCL 2023, PL 4x, Nations League 2019 — zagueiro não marca
  p("Rúben Dias",        "R. Dias",      "RDIAS",      "CB","Portugal","pt","#B91C1C",
    18, 28, 74, 90, 80, 84, 74, 74, 62, 8),

  // João Félix: Copa del Rey, Euro 2024 semi, attacking forward
  p("João Félix",        "J. Félix",     "JOAOFELIX",  "CAM","Portugal","pt","#991B1B",
    64, 70, 68, 78, 72, 74, 64, 74, 60, 13),

  // ── FRANCE ─────────────────────────────────────────────────────────────────
  // Mbappé: WC2018, Nations League 2021, Ligue 1 6x, La Liga (Real Madrid)
  p("Kylian Mbappé",     "Mbappé",       "MBAPPE",     "ST","França","fr","#3B82F6",
    84, 66, 76, 82, 74, 72, 66, 78, 90, 10),

  // Benzema: Ballon d'Or 2022, UCL 5x, La Liga 5x+
  p("Karim Benzema",     "Benzema",      "BENZEMA",    "ST","França","fr","#6366F1",
    75, 68, 84, 90, 80, 92, 84, 68, 68, 9),

  // Griezmann: WC2018, Euro 2016 finalist, La Liga+UEL
  p("Antoine Griezmann", "Griezmann",    "GRIEZMANN",  "CAM","França","fr","#8B5CF6",
    70, 68, 70, 80, 74, 72, 64, 76, 85, 10),

  // Tchouaméni: UCL 2022+2024, La Liga, WC2022 finalist — meia defensivo
  p("Aurélien Tchouaméni","Tchouaméni",  "TCHOU",      "DM","França","fr","#A855F7",
    22, 45, 64, 88, 78, 90, 78, 72, 82, 12),

  // Kolo Muani: WC2022 finalist, Bundesliga+UCL, Ligue 1
  p("Randal Kolo Muani", "Kolo Muani",   "KOLOMUANI",  "ST","França","fr","#7C3AED",
    62, 55, 62, 82, 72, 68, 60, 72, 82, 13),

  // Saliba: PL runner-up Arsenal, WC2022 finalist — zagueiro
  p("William Saliba",    "Saliba",       "SALIBA",     "CB","França","fr","#4F46E5",
    15, 25, 62, 78, 72, 66, 58, 72, 82, 10),

  // ── ALEMANHA ───────────────────────────────────────────────────────────────
  // Kroos: WC2014, UCL 4x (2016-18+2024), La Liga 4x — passe maestro
  p("Toni Kroos",        "Kroos",        "KROOS",      "CM","Alemanha","de","#A3A3A3",
    30, 82, 74, 90, 80, 90, 82, 64, 90, 7),

  // Kimmich: UCL 2020, Bundesliga 8x — CM/FB polivalente, excelente assister
  p("Joshua Kimmich",    "Kimmich",      "KIMMICH",    "CM","Alemanha","de","#71717A",
    36, 74, 70, 88, 80, 84, 76, 66, 54, 8),

  // Musiala: Bundesliga 3x, Euro 2024 semi — CAM muito criativo
  p("Jamal Musiala",     "Musiala",      "MUSIALA",    "CAM","Alemanha","de","#D4D4D8",
    64, 74, 68, 84, 76, 78, 68, 72, 60, 12),

  // Wirtz: Bundesliga 2024 invicto com Leverkusen, Euro 2024 semi
  p("Florian Wirtz",     "Wirtz",        "WIRTZ",      "CAM","Alemanha","de","#E5E7EB",
    65, 76, 66, 84, 76, 74, 66, 72, 60, 13),

  // T. Müller: UCL 2020, Bundesliga 10x, WC2014 — "Raumdeuter", mestre de assists
  p("Thomas Müller",     "T. Müller",    "TMULLER",    "CAM","Alemanha","de","#9CA3AF",
    72, 76, 72, 86, 80, 84, 76, 68, 90, 9),

  // ── HOLANDA ────────────────────────────────────────────────────────────────
  // Van Dijk: UCL 2019, PL 2020, Euro 2024 finalist — zagueiro
  p("Virgil van Dijk",   "Van Dijk",     "VANDIJK",    "CB","Holanda","nl","#F97316",
    30, 35, 72, 82, 72, 82, 70, 74, 64, 8),

  // Gakpo: PL com Liverpool, Euro 2024 finalist
  p("Cody Gakpo",        "Gakpo",        "GAKPO",      "WF","Holanda","nl","#FB923C",
    65, 62, 62, 78, 70, 74, 62, 74, 64, 12),

  // ── BÉLGICA ────────────────────────────────────────────────────────────────
  // De Bruyne: PL 6x, UCL 2023 — recordista de assistências na Premier League
  p("Kevin De Bruyne",   "De Bruyne",    "DEBRUYNE",   "CM","Bélgica","be","#60A5FA",
    42, 97, 78, 90, 80, 84, 74, 62, 62, 8),

  // Courtois: UCL 2022+2024 MVP, La Liga 3x — goleiro não marca
  p("Thibaut Courtois",  "Courtois",     "COURTOIS",   "GK","Bélgica","be","#93C5FD",
    5,  12, 74, 88, 78, 92, 82, 62, 62, 7),

  // ── NORUEGA ────────────────────────────────────────────────────────────────
  // Haaland: UCL 2023, PL 2x, 36 gols em 1 temporada (recorde PL), FA Cup 2023
  p("Erling Haaland",    "Haaland",      "HAALAND",    "ST","Noruega","no","#F59E0B",
    97, 40, 70, 84, 72, 82, 72, 44, 36, 11),

  // ── POLÔNIA ────────────────────────────────────────────────────────────────
  // Lewandowski: UCL 2020, Bundesliga 8x, La Liga 1x, FIFA Best 2020/21
  p("Robert Lewandowski","Lewandowski",  "LEWAND",     "ST","Polônia","pl","#CBD5E1",
    86, 54, 78, 88, 82, 82, 74, 56, 52, 8),

  // ── CROÁCIA ────────────────────────────────────────────────────────────────
  // Modrić: Ballon d'Or 2018, UCL 4x, La Liga 5x, WC2018 finalist, WC2022 3°
  p("Luka Modrić",       "Modrić",       "MODRIC",     "CM","Croácia","hr","#E11D48",
    38, 80, 84, 90, 80, 92, 82, 62, 76, 8),

  // ── SENEGAL ────────────────────────────────────────────────────────────────
  // Mané: UCL 2019, PL 2020, AFCON 2021 — prolific winger
  p("Sadio Mané",        "Mané",         "MANE",       "WF","Senegal","sn","#22C55E",
    70, 65, 70, 80, 72, 82, 70, 74, 46, 10),

  // ── EGITO ──────────────────────────────────────────────────────────────────
  // Salah: UCL 2019, PL 2020, FA Cup, PL Golden Boot múltiplas vezes
  p("Mohamed Salah",     "Salah",        "SALAH",      "WF","Egito","eg","#F97316",
    82, 72, 74, 84, 78, 82, 72, 52, 46, 10),

  // ── MARROCOS ───────────────────────────────────────────────────────────────
  // Hakimi: UCL 2020 (Inter), Ligue 1 3x, WC2022 semi (histórico Marrocos)
  p("Achraf Hakimi",     "Hakimi",       "HAKIMI",     "FB","Marrocos","ma","#DC2626",
    38, 66, 68, 82, 74, 82, 72, 68, 62, 11),

  // ── URUGUAI ────────────────────────────────────────────────────────────────
  // Valverde: UCL 2022+2024, La Liga 3x, Copa América 2024 runner-up
  p("Federico Valverde", "Valverde",     "VALVERDE",   "CM","Uruguai","uy","#60A5FA",
    48, 60, 66, 88, 78, 92, 82, 62, 56, 8),

  // Darwin Núñez: PL com Liverpool, Copa América 2024 runner-up
  p("Darwin Núñez",      "D. Núñez",     "DARWINNUNEZ","ST","Uruguai","uy","#93C5FD",
    64, 50, 62, 74, 68, 72, 62, 62, 56, 13),

  // ── ENGLAND ────────────────────────────────────────────────────────────────
  // Bellingham: UCL 2024, La Liga, Euro 2024 finalist, Golden Boy 2023
  p("Jude Bellingham",   "Bellingham",   "BELLINGHAM", "CAM","Inglaterra","gb-eng","#EF4444",
    66, 75, 72, 86, 74, 88, 78, 62, 58, 12),

  // Foden: UCL 2023, PL 4x, PFA Player of the Year 2024
  p("Phil Foden",        "Foden",        "FODEN",      "CAM","Inglaterra","gb-eng","#DC2626",
    62, 74, 72, 88, 78, 84, 74, 62, 58, 11),

  // Saka: FA Cup, PL runner-up Arsenal, Euro 2024 finalist
  p("Bukayo Saka",       "Saka",         "SAKA",       "WF","Inglaterra","gb-eng","#B91C1C",
    68, 72, 68, 80, 80, 70, 62, 62, 58, 12),

  // Kane: artilheiro all-time da PL, Bundesliga top scorer, sem títulos coletivos
  p("Harry Kane",        "Kane",         "KANE",       "ST","Inglaterra","gb-eng","#9F1239",
    88, 68, 68, 80, 68, 70, 62, 60, 60, 10),

  // Trent: UCL 2019, PL 2020, Euro 2024 finalist — lateral assister nato
  p("Trent Alexander-Arnold","Trent",    "TRENT",      "FB","Inglaterra","gb-eng","#881337",
    38, 88, 68, 82, 72, 82, 72, 60, 58, 10),

  // ── GEÓRGIA ────────────────────────────────────────────────────────────────
  // Kvaratskhelia: Série A 2023 (Napoli histórico), Ligue 1 com PSG
  p("Khvicha Kvaratskhelia","Kvaratskhelia","KVARA",   "WF","Geórgia","ge","#DC2626",
    64, 72, 64, 76, 70, 72, 62, 52, 40, 13),

  // ── ITÁLIA ─────────────────────────────────────────────────────────────────
  // Chiesa: Euro 2020 campeão, Série A
  p("Federico Chiesa",   "Chiesa",       "CHIESA",     "WF","Itália","it","#3B82F6",
    62, 60, 64, 78, 72, 68, 60, 78, 62, 13),

  // ── SÉRVIA ─────────────────────────────────────────────────────────────────
  // Vlahović: Série A, UCL (Juventus)
  p("Dušan Vlahović",    "Vlahović",     "VLAHOVIC",   "ST","Sérvia","rs","#DC2626",
    68, 42, 62, 76, 70, 68, 60, 54, 48, 12),

  // ── PORTUGAL (cont.) ───────────────────────────────────────────────────────
  // Rafael Leão: Série A 2022 (Milan), UCL, Euro 2024 semi
  p("Rafael Leão",       "R. Leão",      "RLEAO",      "WF","Portugal","pt","#FB923C",
    62, 66, 64, 76, 70, 70, 62, 74, 60, 13),

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
  rankings: {
    player: PlayerProfile
    count: number
    avgScore: number
    avgAttributes: Weights
    bestWinScore: number
    bestWinAttributes: Weights
    bestScore: number
    bestAttributes: Weights
  }[]
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

export function runMonteCarlo(weights: Weights, totalProfiles = 10000): SimulationResult {
  const allPlayers = PLAYERS
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0) || 1
  const attrKeys: (keyof Weights)[] = [
    "gols","assistencias","titulosIndividuais","ligaNacional","copaNacional",
    "copaContinentalClubes","mundialClubes","copaContinentalSelecao","copaMundo",
  ]

  // Use running sums to avoid storing all score/attr arrays (memory-efficient)
  const playerWins: Record<string, number> = {}
  const playerScoreSum: Record<string, number> = {}
  const playerAttrSum: Record<string, Record<keyof Weights, number>> = {}
  const histRaw: Record<string, number[]> = {}
  // Best winning scenario (highest score in a round the player won)
  const playerBestWinScore: Record<string, number> = {}
  const playerBestWinAttrs: Record<string, Weights | null> = {}
  // Personal best score regardless of winning
  const playerBestScore: Record<string, number> = {}
  const playerBestAttrs: Record<string, Weights | null> = {}

  allPlayers.forEach((pl) => {
    playerWins[pl.code] = 0
    playerScoreSum[pl.code] = 0
    playerAttrSum[pl.code] = {} as Record<keyof Weights, number>
    attrKeys.forEach(k => { playerAttrSum[pl.code][k] = 0 })
    histRaw[pl.code] = new Array(HIST_COUNT).fill(0)
    playerBestWinScore[pl.code] = -Infinity
    playerBestWinAttrs[pl.code] = null
    playerBestScore[pl.code] = -Infinity
    playerBestAttrs[pl.code] = null
  })

  let globalMaxScore = 0
  let globalMaxPlayer = allPlayers[0]
  const convergenceData: { iteration: number; [key: string]: number }[] = []

  // ── LÓGICA CORRETA: torneio real ──────────────────────────────────────────
  // Cada iteração = 1 eleição da Bola de Ouro.
  // Todos os jogadores recebem um score aleatório simultaneamente.
  // Apenas o maior score vence a iteração.
  // Isso garante que no modo Goleador, Haaland (gols=97) vença Modrić (gols=38).
  for (let i = 0; i < totalProfiles; i++) {
    let roundWinner = allPlayers[0]
    let roundBestScore = -Infinity
    let roundWinnerAttrs: Weights = allPlayers[0].baseAttributes

    for (const player of allPlayers) {
      const attrs: Weights = {
        gols:                   gaussianRandom(player.baseAttributes.gols, player.variance),
        assistencias:           gaussianRandom(player.baseAttributes.assistencias, player.variance),
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
        weights.assistencias * attrs.assistencias +
        weights.titulosIndividuais * attrs.titulosIndividuais +
        weights.ligaNacional * attrs.ligaNacional +
        weights.copaNacional * attrs.copaNacional +
        weights.copaContinentalClubes * attrs.copaContinentalClubes +
        weights.mundialClubes * attrs.mundialClubes +
        weights.copaContinentalSelecao * attrs.copaContinentalSelecao +
        weights.copaMundo * attrs.copaMundo
      ) / totalWeight

      // Accumulate per-player stats (running sums)
      playerScoreSum[player.code] += score
      attrKeys.forEach(k => { playerAttrSum[player.code][k] += attrs[k] })

      if (score > globalMaxScore) { globalMaxScore = score; globalMaxPlayer = player }

      const bi = Math.min(HIST_COUNT - 1, Math.floor((score - HIST_MIN) / HIST_BUCKET_SIZE))
      if (bi >= 0) histRaw[player.code][bi]++

      // Track personal best (independente de vencer)
      if (score > playerBestScore[player.code]) {
        playerBestScore[player.code] = score
        playerBestAttrs[player.code] = { ...attrs }
      }

      if (score > roundBestScore) {
        roundBestScore = score
        roundWinner = player
        roundWinnerAttrs = { ...attrs }
      }
    }

    playerWins[roundWinner.code]++

    // Guarda os atributos exatos do melhor cenário vencedor
    if (roundBestScore > playerBestWinScore[roundWinner.code]) {
      playerBestWinScore[roundWinner.code] = roundBestScore
      playerBestWinAttrs[roundWinner.code] = roundWinnerAttrs
    }

    if ((i + 1) % 500 === 0) {
      const entry: { iteration: number; [key: string]: number } = { iteration: i + 1 }
      allPlayers.forEach((pl) => { entry[pl.code] = playerWins[pl.code] })
      convergenceData.push(entry)
    }
  }

  const rankings = allPlayers.map((player) => {
    const avgScore = playerScoreSum[player.code] / totalProfiles
    const avgAttr = (k: keyof Weights) => playerAttrSum[player.code][k] / totalProfiles
    const fallback = player.baseAttributes
    return {
      player, count: playerWins[player.code], avgScore,
      avgAttributes: {
        gols: avgAttr("gols"), assistencias: avgAttr("assistencias"),
        titulosIndividuais: avgAttr("titulosIndividuais"),
        ligaNacional: avgAttr("ligaNacional"), copaNacional: avgAttr("copaNacional"),
        copaContinentalClubes: avgAttr("copaContinentalClubes"), mundialClubes: avgAttr("mundialClubes"),
        copaContinentalSelecao: avgAttr("copaContinentalSelecao"), copaMundo: avgAttr("copaMundo"),
      },
      bestWinScore: playerBestWinScore[player.code] === -Infinity ? 0 : Math.round(playerBestWinScore[player.code] * 10) / 10,
      bestWinAttributes: playerBestWinAttrs[player.code] ?? fallback,
      bestScore: playerBestScore[player.code] === -Infinity ? 0 : Math.round(playerBestScore[player.code] * 10) / 10,
      bestAttributes: playerBestAttrs[player.code] ?? fallback,
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
    y: Math.round(((player.baseAttributes.gols + player.baseAttributes.assistencias) / 2) * 10) / 10,
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
    const cnt = playerWins[pl.code] || 0
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
  gols: "Gols",
  assistencias: "Assistências",
  titulosIndividuais: "Títulos Individuais",
  ligaNacional: "Liga Nacional",
  copaNacional: "Copa Nacional",
  copaContinentalClubes: "Copa Continental (Clube)",
  mundialClubes: "Mundial de Clubes",
  copaContinentalSelecao: "Copa Continental (Seleção)",
  copaMundo: "Copa do Mundo",
}

export const ATTRIBUTE_LABELS_SHORT: Record<keyof Weights, string> = {
  gols: "Gols",
  assistencias: "Assistências",
  titulosIndividuais: "T. Individuais",
  ligaNacional: "Liga Nac.",
  copaNacional: "Copa Nac.",
  copaContinentalClubes: "Copa Cont. Clube",
  mundialClubes: "Mundial Clubes",
  copaContinentalSelecao: "Copa Cont. Sel.",
  copaMundo: "Copa do Mundo",
}

// Médias calculadas sobre todos os ~50 jogadores do dataset
export const GLOBAL_AVERAGES: Weights = {
  gols: 55,
  assistencias: 63,
  titulosIndividuais: 70,
  ligaNacional: 83,
  copaNacional: 75,
  copaContinentalClubes: 78,
  mundialClubes: 70,
  copaContinentalSelecao: 70,
  copaMundo: 63,
}

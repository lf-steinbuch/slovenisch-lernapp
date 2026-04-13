import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from './supabase'

// ============================================================
// VOKABELDATEN — Erweitertes Vokabular (~100 Einträge)
// ============================================================
const VOCAB = [
  // --- Begrüßung & Höflichkeit (16) ---
  { id: 'b01', sl: 'Dober dan', de: 'Guten Tag', cat: 'Begrüßung', level: 1 },
  { id: 'b02', sl: 'Zdravo', de: 'Hallo', cat: 'Begrüßung', level: 1 },
  { id: 'b03', sl: 'Hvala', de: 'Danke', cat: 'Begrüßung', level: 1 },
  { id: 'b04', sl: 'Prosim', de: 'Bitte', cat: 'Begrüßung', level: 1 },
  { id: 'b05', sl: 'Da', de: 'Ja', cat: 'Begrüßung', level: 1 },
  { id: 'b06', sl: 'Ne', de: 'Nein', cat: 'Begrüßung', level: 1 },
  { id: 'b07', sl: 'Nasvidenje', de: 'Auf Wiedersehen', cat: 'Begrüßung', level: 1 },
  { id: 'b08', sl: 'Dobro jutro', de: 'Guten Morgen', cat: 'Begrüßung', level: 1 },
  { id: 'b09', sl: 'Dober večer', de: 'Guten Abend', cat: 'Begrüßung', level: 1 },
  { id: 'b10', sl: 'Lahko noč', de: 'Gute Nacht', cat: 'Begrüßung', level: 1 },
  { id: 'b11', sl: 'Oprostite', de: 'Entschuldigung', cat: 'Begrüßung', level: 1 },
  { id: 'b12', sl: 'Kako se imate?', de: 'Wie geht es Ihnen?', cat: 'Begrüßung', level: 1 },
  { id: 'b13', sl: 'Kako si?', de: 'Wie geht es dir?', cat: 'Begrüßung', level: 1 },
  { id: 'b14', sl: 'Hvala lepa', de: 'Vielen Dank', cat: 'Begrüßung', level: 1 },
  { id: 'b15', sl: 'Ni za kaj', de: 'Keine Ursache', cat: 'Begrüßung', level: 2 },
  { id: 'b16', sl: 'Živjo', de: 'Hi / Tschüss', cat: 'Begrüßung', level: 1 },

  // --- Zahlen (15) ---
  { id: 'z01', sl: 'ena', de: 'eins', cat: 'Zahlen', level: 1 },
  { id: 'z02', sl: 'dva', de: 'zwei', cat: 'Zahlen', level: 1 },
  { id: 'z03', sl: 'tri', de: 'drei', cat: 'Zahlen', level: 1 },
  { id: 'z04', sl: 'štiri', de: 'vier', cat: 'Zahlen', level: 1 },
  { id: 'z05', sl: 'pet', de: 'fünf', cat: 'Zahlen', level: 1 },
  { id: 'z06', sl: 'šest', de: 'sechs', cat: 'Zahlen', level: 1 },
  { id: 'z07', sl: 'sedem', de: 'sieben', cat: 'Zahlen', level: 1 },
  { id: 'z08', sl: 'osem', de: 'acht', cat: 'Zahlen', level: 1 },
  { id: 'z09', sl: 'devet', de: 'neun', cat: 'Zahlen', level: 1 },
  { id: 'z10', sl: 'deset', de: 'zehn', cat: 'Zahlen', level: 1 },
  { id: 'z11', sl: 'dvajset', de: 'zwanzig', cat: 'Zahlen', level: 2 },
  { id: 'z12', sl: 'trideset', de: 'dreißig', cat: 'Zahlen', level: 2 },
  { id: 'z13', sl: 'sto', de: 'hundert', cat: 'Zahlen', level: 2 },
  { id: 'z14', sl: 'tisoč', de: 'tausend', cat: 'Zahlen', level: 2 },
  { id: 'z15', sl: 'nič', de: 'null', cat: 'Zahlen', level: 1 },

  // --- Essen & Trinken (14) ---
  { id: 'e01', sl: 'voda', de: 'Wasser', cat: 'Essen & Trinken', level: 1 },
  { id: 'e02', sl: 'kruh', de: 'Brot', cat: 'Essen & Trinken', level: 1 },
  { id: 'e03', sl: 'mleko', de: 'Milch', cat: 'Essen & Trinken', level: 1 },
  { id: 'e04', sl: 'kava', de: 'Kaffee', cat: 'Essen & Trinken', level: 1 },
  { id: 'e05', sl: 'čaj', de: 'Tee', cat: 'Essen & Trinken', level: 1 },
  { id: 'e06', sl: 'pivo', de: 'Bier', cat: 'Essen & Trinken', level: 1 },
  { id: 'e07', sl: 'vino', de: 'Wein', cat: 'Essen & Trinken', level: 1 },
  { id: 'e08', sl: 'jabolko', de: 'Apfel', cat: 'Essen & Trinken', level: 1 },
  { id: 'e09', sl: 'sir', de: 'Käse', cat: 'Essen & Trinken', level: 1 },
  { id: 'e10', sl: 'meso', de: 'Fleisch', cat: 'Essen & Trinken', level: 1 },
  { id: 'e11', sl: 'solata', de: 'Salat', cat: 'Essen & Trinken', level: 2 },
  { id: 'e12', sl: 'juha', de: 'Suppe', cat: 'Essen & Trinken', level: 2 },
  { id: 'e13', sl: 'sladoled', de: 'Eis (Speiseeis)', cat: 'Essen & Trinken', level: 2 },
  { id: 'e14', sl: 'pomaranča', de: 'Orange', cat: 'Essen & Trinken', level: 2 },

  // --- Familie & Menschen (12) ---
  { id: 'f01', sl: 'mama', de: 'Mama', cat: 'Familie', level: 1 },
  { id: 'f02', sl: 'oče', de: 'Vater', cat: 'Familie', level: 1 },
  { id: 'f03', sl: 'brat', de: 'Bruder', cat: 'Familie', level: 1 },
  { id: 'f04', sl: 'sestra', de: 'Schwester', cat: 'Familie', level: 1 },
  { id: 'f05', sl: 'prijatelj', de: 'Freund', cat: 'Familie', level: 1 },
  { id: 'f06', sl: 'otrok', de: 'Kind', cat: 'Familie', level: 1 },
  { id: 'f07', sl: 'babica', de: 'Oma', cat: 'Familie', level: 1 },
  { id: 'f08', sl: 'dedek', de: 'Opa', cat: 'Familie', level: 1 },
  { id: 'f09', sl: 'družina', de: 'Familie', cat: 'Familie', level: 2 },
  { id: 'f10', sl: 'prijateljica', de: 'Freundin', cat: 'Familie', level: 2 },
  { id: 'f11', sl: 'bratranec', de: 'Cousin', cat: 'Familie', level: 2 },
  { id: 'f12', sl: 'sestrična', de: 'Cousine', cat: 'Familie', level: 2 },

  // --- Orte & Natur (12) ---
  { id: 'o01', sl: 'hiša', de: 'Haus', cat: 'Orte', level: 1 },
  { id: 'o02', sl: 'šola', de: 'Schule', cat: 'Orte', level: 1 },
  { id: 'o03', sl: 'mesto', de: 'Stadt', cat: 'Orte', level: 1 },
  { id: 'o04', sl: 'Ljubljana', de: 'Ljubljana (Hauptstadt)', cat: 'Orte', level: 1 },
  { id: 'o05', sl: 'Slovenija', de: 'Slowenien', cat: 'Orte', level: 1 },
  { id: 'o06', sl: 'gora', de: 'Berg', cat: 'Orte', level: 1 },
  { id: 'o07', sl: 'morje', de: 'Meer', cat: 'Orte', level: 1 },
  { id: 'o08', sl: 'jezero', de: 'See', cat: 'Orte', level: 1 },
  { id: 'o09', sl: 'reka', de: 'Fluss', cat: 'Orte', level: 2 },
  { id: 'o10', sl: 'gozd', de: 'Wald', cat: 'Orte', level: 2 },
  { id: 'o11', sl: 'plaža', de: 'Strand', cat: 'Orte', level: 2 },
  { id: 'o12', sl: 'trgovina', de: 'Geschäft', cat: 'Orte', level: 2 },

  // --- Nützliche Sätze (15) ---
  { id: 's01', sl: 'Koliko stane?', de: 'Wie viel kostet das?', cat: 'Sätze', level: 1 },
  { id: 's02', sl: 'Ne razumem', de: 'Ich verstehe nicht', cat: 'Sätze', level: 1 },
  { id: 's03', sl: 'Govorite nemško?', de: 'Sprechen Sie Deutsch?', cat: 'Sätze', level: 1 },
  { id: 's04', sl: 'Kje je ...?', de: 'Wo ist ...?', cat: 'Sätze', level: 1 },
  { id: 's05', sl: 'Jaz sem ...', de: 'Ich bin ...', cat: 'Sätze', level: 1 },
  { id: 's06', sl: 'Imam rad', de: 'Ich mag (m)', cat: 'Sätze', level: 1 },
  { id: 's07', sl: 'Lepo je', de: 'Es ist schön', cat: 'Sätze', level: 1 },
  { id: 's08', sl: 'Dober tek', de: 'Guten Appetit', cat: 'Sätze', level: 1 },
  { id: 's09', sl: 'Na zdravje', de: 'Prost / Gesundheit', cat: 'Sätze', level: 1 },
  { id: 's10', sl: 'Rad bi ...', de: 'Ich möchte ...', cat: 'Sätze', level: 1 },
  { id: 's11', sl: 'Pomoč!', de: 'Hilfe!', cat: 'Sätze', level: 2 },
  { id: 's12', sl: 'Vse najboljše!', de: 'Alles Gute!', cat: 'Sätze', level: 2 },
  { id: 's13', sl: 'Imam rada', de: 'Ich mag (f)', cat: 'Sätze', level: 2 },
  { id: 's14', sl: 'Kako se reče ...?', de: 'Wie sagt man ...?', cat: 'Sätze', level: 2 },
  { id: 's15', sl: 'Lahko ponovite?', de: 'Können Sie wiederholen?', cat: 'Sätze', level: 2 },

  // --- Farben (8) ---
  { id: 'c01', sl: 'rdeča', de: 'rot', cat: 'Farben', level: 1 },
  { id: 'c02', sl: 'modra', de: 'blau', cat: 'Farben', level: 1 },
  { id: 'c03', sl: 'zelena', de: 'grün', cat: 'Farben', level: 1 },
  { id: 'c04', sl: 'bela', de: 'weiß', cat: 'Farben', level: 1 },
  { id: 'c05', sl: 'črna', de: 'schwarz', cat: 'Farben', level: 1 },
  { id: 'c06', sl: 'rumena', de: 'gelb', cat: 'Farben', level: 2 },
  { id: 'c07', sl: 'oranžna', de: 'orange', cat: 'Farben', level: 2 },
  { id: 'c08', sl: 'rjava', de: 'braun', cat: 'Farben', level: 2 },

  // --- Körper & Gesundheit (8) ---
  { id: 'k01', sl: 'glava', de: 'Kopf', cat: 'Körper', level: 2 },
  { id: 'k02', sl: 'roka', de: 'Hand / Arm', cat: 'Körper', level: 2 },
  { id: 'k03', sl: 'noga', de: 'Bein / Fuß', cat: 'Körper', level: 2 },
  { id: 'k04', sl: 'oči', de: 'Augen', cat: 'Körper', level: 2 },
  { id: 'k05', sl: 'srce', de: 'Herz', cat: 'Körper', level: 2 },
  { id: 'k06', sl: 'zdravnik', de: 'Arzt', cat: 'Körper', level: 2 },
  { id: 'k07', sl: 'lekarna', de: 'Apotheke', cat: 'Körper', level: 2 },
  { id: 'k08', sl: 'bolan', de: 'krank', cat: 'Körper', level: 2 },

  // --- Zeit & Wochentage (10) ---
  { id: 't01', sl: 'danes', de: 'heute', cat: 'Zeit', level: 1 },
  { id: 't02', sl: 'jutri', de: 'morgen', cat: 'Zeit', level: 1 },
  { id: 't03', sl: 'včeraj', de: 'gestern', cat: 'Zeit', level: 2 },
  { id: 't04', sl: 'ponedeljek', de: 'Montag', cat: 'Zeit', level: 2 },
  { id: 't05', sl: 'torek', de: 'Dienstag', cat: 'Zeit', level: 2 },
  { id: 't06', sl: 'sreda', de: 'Mittwoch', cat: 'Zeit', level: 2 },
  { id: 't07', sl: 'četrtek', de: 'Donnerstag', cat: 'Zeit', level: 2 },
  { id: 't08', sl: 'petek', de: 'Freitag', cat: 'Zeit', level: 2 },
  { id: 't09', sl: 'sobota', de: 'Samstag', cat: 'Zeit', level: 2 },
  { id: 't10', sl: 'nedelja', de: 'Sonntag', cat: 'Zeit', level: 2 },
]

// ============================================================
// KONSTANTEN
// ============================================================
const COLORS = {
  bg: '#0c1222',
  bgGradient: 'linear-gradient(180deg, #0c1222 0%, #0f172a 100%)',
  surface: '#1e293b',
  surfaceLight: '#334155',
  accent: '#059669',
  accentLight: '#34d399',
  accentGlow: 'rgba(52, 211, 153, 0.15)',
  gold: '#fbbf24',
  goldGlow: 'rgba(251, 191, 36, 0.2)',
  danger: '#ef4444',
  dangerGlow: 'rgba(239, 68, 68, 0.15)',
  text: '#f1f5f9',
  textMuted: '#94a3b8',
  textDim: '#64748b',
}

const LEITNER_INTERVALS = [0, 1, 3, 7, 14, 30]
const XP_PER_LEVEL = 100
const DAILY_GOAL = 15
const SESSION_SIZE = 10
const QUIZ_SIZE = 10

const CAT_ICONS = {
  'Begrüßung': '👋',
  'Zahlen': '🔢',
  'Essen & Trinken': '🍽️',
  'Familie': '👨‍👩‍👧‍👦',
  'Orte': '📍',
  'Sätze': '💬',
  'Farben': '🎨',
  'Körper': '🧍',
  'Zeit': '🕐',
}

// ============================================================
// HELPER FUNKTIONEN
// ============================================================
function getToday() {
  return new Date().toISOString().split('T')[0]
}

function daysBetween(dateStr1, dateStr2) {
  const d1 = new Date(dateStr1)
  const d2 = new Date(dateStr2)
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24))
}

function addDays(dateStr, days) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function speak(text) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'sl-SI'
  u.rate = 0.85
  window.speechSynthesis.speak(u)
}

function getDueCards(srsData) {
  const today = getToday()
  return VOCAB.filter(card => {
    const data = srsData[card.id]
    if (!data) return true // new card = due
    if (data.box >= 5 && data.lastReview) {
      const due = addDays(data.lastReview, LEITNER_INTERVALS[5])
      return due <= today
    }
    if (data.lastReview) {
      const due = addDays(data.lastReview, LEITNER_INTERVALS[data.box] || 0)
      return due <= today
    }
    return true
  })
}

function getSessionCards(srsData) {
  const due = getDueCards(srsData)
  // sort by box (lower first = higher priority)
  due.sort((a, b) => {
    const boxA = srsData[a.id]?.box ?? 0
    const boxB = srsData[b.id]?.box ?? 0
    return boxA - boxB
  })
  return due.slice(0, SESSION_SIZE)
}

// ============================================================
// STYLES
// ============================================================
const S = {
  screen: {
    minHeight: '100dvh',
    background: COLORS.bgGradient,
    padding: 'max(env(safe-area-inset-top, 20px), 54px) max(env(safe-area-inset-right, 16px), 16px) max(env(safe-area-inset-bottom, 20px), 20px) max(env(safe-area-inset-left, 16px), 16px)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  btn: {
    minHeight: '48px',
    padding: '12px 24px',
    borderRadius: '14px',
    fontWeight: '600',
    fontSize: 'clamp(15px, 3.8vw, 17px)',
    touchAction: 'manipulation',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    border: 'none',
    cursor: 'pointer',
  },
  btnPrimary: {
    background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
    color: '#fff',
    boxShadow: `0 4px 15px ${COLORS.accentGlow}`,
  },
  btnSecondary: {
    background: COLORS.surface,
    color: COLORS.text,
    border: `1px solid ${COLORS.surfaceLight}`,
  },
  btnDanger: {
    background: `linear-gradient(135deg, ${COLORS.danger}, #f87171)`,
    color: '#fff',
    boxShadow: `0 4px 15px ${COLORS.dangerGlow}`,
  },
  card: {
    background: COLORS.surface,
    borderRadius: '18px',
    padding: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    border: `1px solid rgba(255,255,255,0.05)`,
  },
  input: {
    width: '100%',
    padding: '14px 18px',
    borderRadius: '14px',
    border: `2px solid ${COLORS.surfaceLight}`,
    background: COLORS.surface,
    color: COLORS.text,
    fontSize: '16px',
    fontWeight: '500',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  title: {
    fontSize: 'clamp(24px, 6vw, 32px)',
    fontWeight: '800',
    background: `linear-gradient(135deg, ${COLORS.accentLight}, ${COLORS.gold})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: 'clamp(14px, 3.5vw, 16px)',
    color: COLORS.textMuted,
    fontWeight: '400',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
  },
  progressBar: {
    height: '10px',
    borderRadius: '5px',
    background: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '5px',
    transition: 'width 0.5s ease',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: COLORS.textMuted,
    fontSize: '15px',
    fontWeight: '500',
    padding: '8px 0',
    touchAction: 'manipulation',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
}

// ============================================================
// APP COMPONENT
// ============================================================
export default function App() {
  const [screen, setScreen] = useState('loading')
  const [player, setPlayer] = useState(null)
  const [error, setError] = useState('')

  // Onboarding
  const [authMode, setAuthMode] = useState('choose') // 'choose', 'register', 'login'
  const [nameInput, setNameInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [nameError, setNameError] = useState('')
  const [nameLoading, setNameLoading] = useState(false)

  // Flashcards
  const [sessionCards, setSessionCards] = useState([])
  const [sessionIndex, setSessionIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [sessionStats, setSessionStats] = useState({ correct: 0, wrong: 0, xpEarned: 0 })
  const [repeatQueue, setRepeatQueue] = useState([])
  const [srsChanges, setSrsChanges] = useState({})

  // Quiz
  const [quizCards, setQuizCards] = useState([])
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizOptions, setQuizOptions] = useState([])
  const [quizAnswered, setQuizAnswered] = useState(null)
  const [quizStats, setQuizStats] = useState({ correct: 0, wrong: 0, xpEarned: 0 })

  // Leaderboard
  const [leaderboard, setLeaderboard] = useState([])
  const [lbLoading, setLbLoading] = useState(false)

  // Level-up
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [newLevel, setNewLevel] = useState(0)

  // --------------------------------------------------------
  // INIT: Load player from localStorage / Supabase
  // --------------------------------------------------------
  useEffect(() => {
    async function init() {
      const playerId = localStorage.getItem('slovensko_player_id')
      if (!playerId) {
        setScreen('onboarding')
        return
      }
      try {
        const { data, error } = await supabase
          .from('players')
          .select('*')
          .eq('id', playerId)
          .single()
        if (error || !data) {
          localStorage.removeItem('slovensko_player_id')
          setScreen('onboarding')
          return
        }
        // Day rollover
        const today = getToday()
        let updates = {}
        if (data.today_date !== today) {
          updates.today_reviewed = 0
          updates.today_date = today
          // Streak logic
          if (data.streak_last_date) {
            const diff = daysBetween(data.streak_last_date, today)
            if (diff > 1) {
              updates.streak_count = 0
            }
          }
        }
        if (Object.keys(updates).length > 0) {
          const { data: updated } = await supabase
            .from('players')
            .update(updates)
            .eq('id', playerId)
            .select()
            .single()
          setPlayer(updated || { ...data, ...updates })
        } else {
          setPlayer(data)
        }
        setScreen('home')
      } catch {
        setScreen('onboarding')
      }
    }
    init()
  }, [])

  // --------------------------------------------------------
  // SYNC player to Supabase
  // --------------------------------------------------------
  const syncPlayer = useCallback(async (updates) => {
    if (!player) return player
    const oldLevel = Math.floor(player.xp / XP_PER_LEVEL)
    const merged = { ...player, ...updates }
    const newLvl = Math.floor(merged.xp / XP_PER_LEVEL)
    setPlayer(merged)
    if (newLvl > oldLevel) {
      setNewLevel(newLvl)
      setShowLevelUp(true)
      setTimeout(() => setShowLevelUp(false), 2500)
    }
    try {
      await supabase
        .from('players')
        .update(updates)
        .eq('id', player.id)
    } catch { /* ignore */ }
    return merged
  }, [player])

  // --------------------------------------------------------
  // ONBOARDING
  // --------------------------------------------------------
  async function handleRegister() {
    const name = nameInput.trim()
    const password = passwordInput
    if (name.length < 2) { setNameError('Name: mindestens 2 Zeichen'); return }
    if (name.length > 20) { setNameError('Name: maximal 20 Zeichen'); return }
    if (password.length < 4) { setNameError('Passwort: mindestens 4 Zeichen'); return }
    setNameLoading(true)
    setNameError('')
    try {
      const { data: existing } = await supabase
        .from('players')
        .select('id')
        .eq('name', name)
        .maybeSingle()
      if (existing) {
        setNameError('Name ist bereits vergeben')
        setNameLoading(false)
        return
      }
      const today = getToday()
      const { data, error } = await supabase
        .from('players')
        .insert({
          name,
          password,
          xp: 0,
          streak_count: 0,
          streak_last_date: null,
          srs_data: {},
          today_reviewed: 0,
          today_date: today,
        })
        .select()
        .single()
      if (error) throw error
      localStorage.setItem('slovensko_player_id', data.id)
      setPlayer(data)
      setScreen('home')
    } catch (e) {
      setNameError('Fehler bei der Registrierung. Versuche es erneut.')
    }
    setNameLoading(false)
  }

  async function handleLogin() {
    const name = nameInput.trim()
    const password = passwordInput
    if (!name || !password) { setNameError('Name und Passwort eingeben'); return }
    setNameLoading(true)
    setNameError('')
    try {
      const { data } = await supabase
        .from('players')
        .select('*')
        .eq('name', name)
        .eq('password', password)
        .maybeSingle()
      if (!data) {
        setNameError('Name oder Passwort falsch')
        setNameLoading(false)
        return
      }
      localStorage.setItem('slovensko_player_id', data.id)
      // Day rollover
      const today = getToday()
      let updates = {}
      if (data.today_date !== today) {
        updates.today_reviewed = 0
        updates.today_date = today
        if (data.streak_last_date) {
          const diff = daysBetween(data.streak_last_date, today)
          if (diff > 1) updates.streak_count = 0
        }
      }
      if (Object.keys(updates).length > 0) {
        const { data: updated } = await supabase
          .from('players').update(updates).eq('id', data.id).select().single()
        setPlayer(updated || { ...data, ...updates })
      } else {
        setPlayer(data)
      }
      setScreen('home')
    } catch {
      setNameError('Fehler beim Anmelden. Versuche es erneut.')
    }
    setNameLoading(false)
  }

  // --------------------------------------------------------
  // FLASHCARD SESSION
  // --------------------------------------------------------
  function startFlashcards() {
    const srs = player.srs_data || {}
    const cards = getSessionCards(srs)
    if (cards.length === 0) {
      setError('Keine Karten fällig! Komm später wieder.')
      setTimeout(() => setError(''), 2500)
      return
    }
    setSessionCards(cards)
    setSessionIndex(0)
    setFlipped(false)
    setSessionStats({ correct: 0, wrong: 0, xpEarned: 0 })
    setRepeatQueue([])
    setSrsChanges({})
    setScreen('flashcards')
  }

  function handleFlip() {
    setFlipped(true)
    const card = currentFlashcard()
    if (card) speak(card.sl)
  }

  function currentFlashcard() {
    if (sessionIndex < sessionCards.length) return sessionCards[sessionIndex]
    const rqi = sessionIndex - sessionCards.length
    if (rqi < repeatQueue.length) return repeatQueue[rqi]
    return null
  }

  function handleCardRate(correct) {
    const card = currentFlashcard()
    if (!card) return
    const srs = { ...(player.srs_data || {}), ...srsChanges }
    const current = srs[card.id] || { box: 0, lastReview: null }
    const today = getToday()
    let newBox, xpGain
    if (correct) {
      newBox = Math.min(current.box + 1, 5)
      xpGain = 10 + current.box * 5
    } else {
      newBox = 0
      xpGain = 2
      // add to repeat queue (only if not already from repeat queue)
      if (sessionIndex < sessionCards.length) {
        setRepeatQueue(q => [...q, card])
      }
    }
    const newSrsChanges = {
      ...srsChanges,
      [card.id]: { box: newBox, lastReview: today },
    }
    setSrsChanges(newSrsChanges)
    setSessionStats(s => ({
      correct: s.correct + (correct ? 1 : 0),
      wrong: s.wrong + (correct ? 0 : 1),
      xpEarned: s.xpEarned + xpGain,
    }))
    // Advance
    const nextIndex = sessionIndex + 1
    const totalCards = sessionCards.length + (correct ? repeatQueue.length : repeatQueue.length + (sessionIndex < sessionCards.length ? 1 : 0))
    setSessionIndex(nextIndex)
    setFlipped(false)
  }

  function isSessionDone() {
    return sessionIndex >= sessionCards.length + repeatQueue.length
  }

  async function finishSession() {
    const today = getToday()
    const newSrs = { ...(player.srs_data || {}), ...srsChanges }
    const reviewed = (player.today_reviewed || 0) + sessionStats.correct + sessionStats.wrong
    const newXp = (player.xp || 0) + sessionStats.xpEarned
    // Streak
    let streakCount = player.streak_count || 0
    let streakLast = player.streak_last_date
    if (streakLast !== today) {
      streakCount += 1
      streakLast = today
    }
    await syncPlayer({
      srs_data: newSrs,
      xp: newXp,
      today_reviewed: reviewed,
      today_date: today,
      streak_count: streakCount,
      streak_last_date: streakLast,
    })
    setScreen('home')
  }

  // --------------------------------------------------------
  // QUIZ
  // --------------------------------------------------------
  function startQuiz() {
    const cards = shuffle(VOCAB).slice(0, QUIZ_SIZE)
    setQuizCards(cards)
    setQuizIndex(0)
    setQuizAnswered(null)
    setQuizStats({ correct: 0, wrong: 0, xpEarned: 0 })
    generateQuizOptions(cards, 0)
    setScreen('quiz')
  }

  function generateQuizOptions(cards, idx) {
    const card = cards[idx]
    if (!card) return
    // Get distractors from same category
    const sameCat = VOCAB.filter(v => v.cat === card.cat && v.id !== card.id)
    const otherCat = VOCAB.filter(v => v.cat !== card.cat)
    let distractors = shuffle(sameCat).slice(0, 2)
    // fill from other categories if needed
    while (distractors.length < 2) {
      const extra = shuffle(otherCat).find(v => !distractors.some(d => d.id === v.id))
      if (extra) distractors.push(extra)
      else break
    }
    const options = shuffle([card, ...distractors])
    setQuizOptions(options)
  }

  function handleQuizAnswer(selectedId) {
    if (quizAnswered !== null) return
    const card = quizCards[quizIndex]
    const correct = selectedId === card.id
    setQuizAnswered(selectedId)
    setQuizStats(s => ({
      correct: s.correct + (correct ? 1 : 0),
      wrong: s.wrong + (correct ? 0 : 1),
      xpEarned: s.xpEarned + (correct ? 15 : 0),
    }))
    // Auto-advance after delay
    setTimeout(() => {
      const next = quizIndex + 1
      if (next >= quizCards.length) {
        setQuizIndex(next) // triggers summary
      } else {
        setQuizIndex(next)
        setQuizAnswered(null)
        generateQuizOptions(quizCards, next)
      }
    }, 1500)
  }

  function playQuizAudio() {
    const card = quizCards[quizIndex]
    if (card) speak(card.sl)
  }

  async function finishQuiz() {
    const today = getToday()
    const reviewed = (player.today_reviewed || 0) + quizStats.correct + quizStats.wrong
    const newXp = (player.xp || 0) + quizStats.xpEarned
    let streakCount = player.streak_count || 0
    let streakLast = player.streak_last_date
    if (streakLast !== today) {
      streakCount += 1
      streakLast = today
    }
    await syncPlayer({
      xp: newXp,
      today_reviewed: reviewed,
      today_date: today,
      streak_count: streakCount,
      streak_last_date: streakLast,
    })
    setScreen('home')
  }

  // --------------------------------------------------------
  // LEADERBOARD
  // --------------------------------------------------------
  async function loadLeaderboard() {
    setLbLoading(true)
    try {
      const { data } = await supabase
        .from('players')
        .select('id, name, xp, streak_count')
        .order('xp', { ascending: false })
        .limit(20)
      setLeaderboard(data || [])
    } catch { /* ignore */ }
    setLbLoading(false)
  }

  // --------------------------------------------------------
  // PLAY AUDIO HELPER
  // --------------------------------------------------------
  useEffect(() => {
    // Auto-play quiz audio when question changes
    if (screen === 'quiz' && quizIndex < quizCards.length && quizAnswered === null) {
      setTimeout(() => playQuizAudio(), 300)
    }
  }, [quizIndex, screen])

  // --------------------------------------------------------
  // RENDER
  // --------------------------------------------------------

  // -- Loading --
  if (screen === 'loading') {
    return (
      <div style={{ ...S.screen, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ animation: 'pulse 1.5s ease infinite' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', textAlign: 'center' }}>🇸🇮</div>
          <div style={{ ...S.subtitle, textAlign: 'center' }}>Laden...</div>
        </div>
      </div>
    )
  }

  // -- Onboarding --
  if (screen === 'onboarding') {
    // Header (shared)
    const header = (
      <div style={{ textAlign: 'center', animation: 'fadeIn 0.6s ease' }}>
        <div style={{ fontSize: '64px', marginBottom: '12px' }}>🇸🇮</div>
        <h1 style={S.title}>Slovensko!</h1>
        <p style={{ ...S.subtitle, marginTop: '8px' }}>Lerne Slowenisch mit deinen Cousins</p>
      </div>
    )

    // Choose: Register or Login
    if (authMode === 'choose') {
      return (
        <div style={{ ...S.screen, alignItems: 'center', justifyContent: 'center', gap: '32px', padding: '24px' }}>
          {header}
          <div style={{ width: '100%', maxWidth: '340px', display: 'flex', flexDirection: 'column', gap: '12px', animation: 'slideUp 0.6s ease 0.2s both' }}>
            <button
              style={{ ...S.btn, ...S.btnPrimary, width: '100%' }}
              onClick={() => { setAuthMode('register'); setNameError(''); setNameInput(''); setPasswordInput('') }}
            >
              Neu hier? Registrieren 🚀
            </button>
            <button
              style={{ ...S.btn, ...S.btnSecondary, width: '100%' }}
              onClick={() => { setAuthMode('login'); setNameError(''); setNameInput(''); setPasswordInput('') }}
            >
              Ich habe einen Account 🔑
            </button>
          </div>
        </div>
      )
    }

    // Register
    if (authMode === 'register') {
      return (
        <div style={{ ...S.screen, alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '24px' }}>
          {header}
          <div style={{ width: '100%', maxWidth: '340px', display: 'flex', flexDirection: 'column', gap: '12px', animation: 'slideUp 0.5s ease' }}>
            <input
              style={{ ...S.input, borderColor: nameError ? COLORS.danger : COLORS.surfaceLight, textAlign: 'center' }}
              placeholder="Dein Name"
              value={nameInput}
              onChange={e => { setNameInput(e.target.value); setNameError('') }}
              maxLength={20}
              autoFocus
            />
            <input
              style={{ ...S.input, borderColor: nameError ? COLORS.danger : COLORS.surfaceLight, textAlign: 'center' }}
              placeholder="Passwort wählen (min. 4 Zeichen)"
              type="password"
              value={passwordInput}
              onChange={e => { setPasswordInput(e.target.value); setNameError('') }}
              onKeyDown={e => e.key === 'Enter' && handleRegister()}
            />
            {nameError && (
              <p style={{ color: COLORS.danger, fontSize: '13px', textAlign: 'center', animation: 'shake 0.4s ease' }}>
                {nameError}
              </p>
            )}
            <button
              style={{ ...S.btn, ...S.btnPrimary, width: '100%', opacity: nameLoading ? 0.6 : 1 }}
              onClick={handleRegister}
              disabled={nameLoading}
            >
              {nameLoading ? 'Wird geladen...' : 'Registrieren 🚀'}
            </button>
            <button
              style={{ ...S.backBtn, width: '100%', justifyContent: 'center', marginTop: '4px' }}
              onClick={() => setAuthMode('choose')}
            >
              ← Zurück
            </button>
          </div>
        </div>
      )
    }

    // Login
    if (authMode === 'login') {
      return (
        <div style={{ ...S.screen, alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '24px' }}>
          {header}
          <div style={{ width: '100%', maxWidth: '340px', display: 'flex', flexDirection: 'column', gap: '12px', animation: 'slideUp 0.5s ease' }}>
            <input
              style={{ ...S.input, borderColor: nameError ? COLORS.danger : COLORS.surfaceLight, textAlign: 'center' }}
              placeholder="Dein Name"
              value={nameInput}
              onChange={e => { setNameInput(e.target.value); setNameError('') }}
              maxLength={20}
              autoFocus
            />
            <input
              style={{ ...S.input, borderColor: nameError ? COLORS.danger : COLORS.surfaceLight, textAlign: 'center' }}
              placeholder="Dein Passwort"
              type="password"
              value={passwordInput}
              onChange={e => { setPasswordInput(e.target.value); setNameError('') }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            {nameError && (
              <p style={{ color: COLORS.danger, fontSize: '13px', textAlign: 'center', animation: 'shake 0.4s ease' }}>
                {nameError}
              </p>
            )}
            <button
              style={{ ...S.btn, ...S.btnPrimary, width: '100%', opacity: nameLoading ? 0.6 : 1 }}
              onClick={handleLogin}
              disabled={nameLoading}
            >
              {nameLoading ? 'Wird geladen...' : 'Anmelden 🔑'}
            </button>
            <button
              style={{ ...S.backBtn, width: '100%', justifyContent: 'center', marginTop: '4px' }}
              onClick={() => setAuthMode('choose')}
            >
              ← Zurück
            </button>
          </div>
        </div>
      )
    }
  }

  // -- Home --
  if (screen === 'home') {
    const p = player || {}
    const level = Math.floor((p.xp || 0) / XP_PER_LEVEL)
    const xpInLevel = (p.xp || 0) % XP_PER_LEVEL
    const dueCount = getDueCards(p.srs_data || {}).length
    const reviewed = p.today_reviewed || 0
    const goalProgress = Math.min(reviewed / DAILY_GOAL, 1)
    const streakAtRisk = p.streak_count > 0 && p.streak_last_date !== getToday()
    const goalReached = reviewed >= DAILY_GOAL

    return (
      <div style={{ ...S.screen, gap: '16px' }}>
        {/* Header */}
        <div style={{ animation: 'fadeIn 0.4s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(22px, 5.5vw, 28px)', fontWeight: '700' }}>
                Hej, {p.name}! 👋
              </h1>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                <span style={{ ...S.badge, background: COLORS.accentGlow, color: COLORS.accentLight }}>
                  ⭐ Level {level}
                </span>
                <span style={{ ...S.badge, background: 'rgba(255,255,255,0.06)', color: COLORS.textMuted }}>
                  {p.xp || 0} XP
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '32px',
                animation: streakAtRisk ? 'pulse 1.5s ease infinite' : 'none',
              }}>🔥</div>
              <div style={{
                fontSize: '13px',
                fontWeight: '700',
                color: streakAtRisk ? COLORS.gold : COLORS.text,
              }}>
                {p.streak_count || 0} Tage
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div style={{ marginTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: COLORS.textMuted, marginBottom: '4px' }}>
              <span>Level {level}</span>
              <span>{xpInLevel}/{XP_PER_LEVEL} XP</span>
            </div>
            <div style={S.progressBar}>
              <div style={{
                ...S.progressFill,
                width: `${(xpInLevel / XP_PER_LEVEL) * 100}%`,
                background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accentLight})`,
              }} />
            </div>
          </div>
        </div>

        {/* Streak Warning */}
        {streakAtRisk && (
          <div style={{
            ...S.card,
            background: COLORS.goldGlow,
            border: `1px solid ${COLORS.gold}`,
            padding: '14px 16px',
            animation: 'glow 2s ease infinite, fadeIn 0.4s ease',
          }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: COLORS.gold }}>
              ⚠️ Dein {p.streak_count}-Tage-Streak ist in Gefahr!
            </div>
            <div style={{ fontSize: '13px', color: COLORS.textMuted, marginTop: '4px' }}>
              Mach heute noch eine Übung, um ihn zu behalten.
            </div>
          </div>
        )}

        {/* Daily Goal */}
        <div style={{ ...S.card, animation: 'fadeIn 0.4s ease 0.1s both' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>
              {goalReached ? '🎉 Tagesziel erreicht!' : '📝 Tagesziel'}
            </span>
            <span style={{ fontSize: '13px', color: COLORS.textMuted }}>
              {reviewed}/{DAILY_GOAL}
            </span>
          </div>
          <div style={S.progressBar}>
            <div style={{
              ...S.progressFill,
              width: `${goalProgress * 100}%`,
              background: goalReached
                ? `linear-gradient(90deg, ${COLORS.gold}, #fcd34d)`
                : `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accentLight})`,
              animation: 'progressFill 0.8s ease',
            }} />
          </div>
        </div>

        {/* Action Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
          <button
            style={{
              ...S.card,
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              cursor: 'pointer',
              touchAction: 'manipulation',
              textAlign: 'left',
              animation: 'fadeIn 0.4s ease 0.2s both',
              border: `1px solid rgba(52, 211, 153, 0.2)`,
            }}
            onClick={startFlashcards}
          >
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px',
              background: COLORS.accentGlow,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', flexShrink: 0,
            }}>📇</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: '700', fontSize: 'clamp(16px, 4vw, 18px)' }}>Karteikarten</div>
              <div style={{ fontSize: '13px', color: COLORS.textMuted, marginTop: '2px' }}>
                {dueCount} Karten fällig
              </div>
            </div>
            <div style={{ color: COLORS.textDim, fontSize: '20px' }}>›</div>
          </button>

          <button
            style={{
              ...S.card,
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              cursor: 'pointer',
              touchAction: 'manipulation',
              textAlign: 'left',
              animation: 'fadeIn 0.4s ease 0.3s both',
              border: `1px solid rgba(251, 191, 36, 0.15)`,
            }}
            onClick={startQuiz}
          >
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px',
              background: COLORS.goldGlow,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', flexShrink: 0,
            }}>🎧</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: '700', fontSize: 'clamp(16px, 4vw, 18px)' }}>Hörquiz</div>
              <div style={{ fontSize: '13px', color: COLORS.textMuted, marginTop: '2px' }}>
                Teste dein Hörverstehen
              </div>
            </div>
            <div style={{ color: COLORS.textDim, fontSize: '20px' }}>›</div>
          </button>

          <button
            style={{
              ...S.card,
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              cursor: 'pointer',
              touchAction: 'manipulation',
              textAlign: 'left',
              animation: 'fadeIn 0.4s ease 0.4s both',
            }}
            onClick={() => { loadLeaderboard(); setScreen('leaderboard') }}
          >
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px',
              background: 'rgba(255,255,255,0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', flexShrink: 0,
            }}>🏆</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: '700', fontSize: 'clamp(16px, 4vw, 18px)' }}>Leaderboard</div>
              <div style={{ fontSize: '13px', color: COLORS.textMuted, marginTop: '2px' }}>
                Sieh, wer vorne liegt
              </div>
            </div>
            <div style={{ color: COLORS.textDim, fontSize: '20px' }}>›</div>
          </button>
        </div>

        {/* Vocab Stats */}
        <div style={{ fontSize: '12px', color: COLORS.textDim, textAlign: 'center', paddingBottom: '8px' }}>
          {VOCAB.length} Vokabeln · {Object.keys(p.srs_data || {}).length} gelernt
        </div>

        {/* Error Toast */}
        {error && (
          <div style={{
            position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)',
            background: COLORS.surface, color: COLORS.text, padding: '12px 20px',
            borderRadius: '12px', fontSize: '14px', fontWeight: '500',
            boxShadow: '0 8px 30px rgba(0,0,0,0.4)', animation: 'slideUp 0.3s ease',
            zIndex: 100, whiteSpace: 'nowrap',
          }}>
            {error}
          </div>
        )}

        {/* Level Up Overlay */}
        {showLevelUp && <LevelUpOverlay level={newLevel} />}
      </div>
    )
  }

  // -- Flashcards --
  if (screen === 'flashcards') {
    const card = currentFlashcard()
    const total = sessionCards.length + repeatQueue.length
    const done = isSessionDone()

    if (done) {
      return (
        <div style={{ ...S.screen, alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '24px' }}>
          <div style={{ textAlign: 'center', animation: 'popIn 0.5s ease' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>
              {sessionStats.correct > sessionStats.wrong ? '🎉' : '💪'}
            </div>
            <h2 style={{ fontSize: 'clamp(22px, 5.5vw, 28px)', fontWeight: '700' }}>Session fertig!</h2>
          </div>
          <div style={{ ...S.card, width: '100%', maxWidth: '340px', animation: 'slideUp 0.5s ease 0.2s both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: COLORS.accentLight }}>{sessionStats.correct}</div>
                <div style={{ fontSize: '12px', color: COLORS.textMuted }}>Richtig</div>
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: COLORS.danger }}>{sessionStats.wrong}</div>
                <div style={{ fontSize: '12px', color: COLORS.textMuted }}>Falsch</div>
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: COLORS.gold }}>+{sessionStats.xpEarned}</div>
                <div style={{ fontSize: '12px', color: COLORS.textMuted }}>XP</div>
              </div>
            </div>
          </div>
          <button
            style={{ ...S.btn, ...S.btnPrimary, width: '100%', maxWidth: '340px' }}
            onClick={finishSession}
          >
            Weiter
          </button>
        </div>
      )
    }

    return (
      <div style={{ ...S.screen, gap: '16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: COLORS.textMuted, fontWeight: '600' }}>
            {sessionIndex + 1} / {total}
          </span>
        </div>

        {/* Progress */}
        <div style={S.progressBar}>
          <div style={{
            ...S.progressFill,
            width: `${((sessionIndex) / total) * 100}%`,
            background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accentLight})`,
          }} />
        </div>

        {/* Card */}
        {card && (
          <div style={{
            ...S.card,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            animation: 'fadeIn 0.3s ease',
            minHeight: '300px',
          }}>
            <span style={{
              ...S.badge,
              background: 'rgba(255,255,255,0.06)',
              color: COLORS.textMuted,
            }}>
              {CAT_ICONS[card.cat] || '📖'} {card.cat}
            </span>

            <div style={{
              fontSize: 'clamp(26px, 7vw, 36px)',
              fontWeight: '700',
              textAlign: 'center',
              lineHeight: 1.3,
            }}>
              {card.de}
            </div>

            {!flipped ? (
              <button
                style={{ ...S.btn, ...S.btnPrimary, minWidth: '200px', marginTop: '16px' }}
                onClick={handleFlip}
              >
                Aufdecken 👀
              </button>
            ) : (
              <>
                <div style={{
                  fontSize: 'clamp(28px, 8vw, 40px)',
                  fontWeight: '800',
                  color: COLORS.accentLight,
                  textAlign: 'center',
                  animation: 'popIn 0.4s ease',
                  lineHeight: 1.3,
                }}>
                  {card.sl}
                </div>
                <button
                  style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', touchAction: 'manipulation', padding: '8px' }}
                  onClick={() => speak(card.sl)}
                >
                  🔊
                </button>
              </>
            )}
          </div>
        )}

        {/* Rating Buttons */}
        {flipped && (
          <div style={{ display: 'flex', gap: '12px', animation: 'slideUp 0.3s ease' }}>
            <button
              style={{ ...S.btn, ...S.btnDanger, flex: 1 }}
              onClick={() => handleCardRate(false)}
            >
              Nochmal ✗
            </button>
            <button
              style={{ ...S.btn, ...S.btnPrimary, flex: 1 }}
              onClick={() => handleCardRate(true)}
            >
              Gewusst! ✓
            </button>
          </div>
        )}

        {/* Bottom Back Button */}
        <button
          style={{ ...S.btn, ...S.btnSecondary, width: '100%' }}
          onClick={() => { finishSession() }}
        >
          ← Zurück
        </button>

        {showLevelUp && <LevelUpOverlay level={newLevel} />}
      </div>
    )
  }

  // -- Quiz --
  if (screen === 'quiz') {
    const done = quizIndex >= quizCards.length

    if (done) {
      return (
        <div style={{ ...S.screen, alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '24px' }}>
          <div style={{ textAlign: 'center', animation: 'popIn 0.5s ease' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>
              {quizStats.correct >= 7 ? '🏆' : quizStats.correct >= 4 ? '👍' : '📚'}
            </div>
            <h2 style={{ fontSize: 'clamp(22px, 5.5vw, 28px)', fontWeight: '700' }}>Quiz fertig!</h2>
          </div>
          <div style={{ ...S.card, width: '100%', maxWidth: '340px', animation: 'slideUp 0.5s ease 0.2s both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: COLORS.accentLight }}>{quizStats.correct}</div>
                <div style={{ fontSize: '12px', color: COLORS.textMuted }}>Richtig</div>
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: COLORS.danger }}>{quizStats.wrong}</div>
                <div style={{ fontSize: '12px', color: COLORS.textMuted }}>Falsch</div>
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: COLORS.gold }}>+{quizStats.xpEarned}</div>
                <div style={{ fontSize: '12px', color: COLORS.textMuted }}>XP</div>
              </div>
            </div>
          </div>
          <button
            style={{ ...S.btn, ...S.btnPrimary, width: '100%', maxWidth: '340px' }}
            onClick={finishQuiz}
          >
            Weiter
          </button>
        </div>
      )
    }

    const card = quizCards[quizIndex]
    return (
      <div style={{ ...S.screen, gap: '16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: COLORS.textMuted, fontWeight: '600' }}>
            {quizIndex + 1} / {QUIZ_SIZE}
          </span>
        </div>

        {/* Progress */}
        <div style={S.progressBar}>
          <div style={{
            ...S.progressFill,
            width: `${(quizIndex / QUIZ_SIZE) * 100}%`,
            background: `linear-gradient(90deg, ${COLORS.gold}, #fcd34d)`,
          }} />
        </div>

        {/* Question */}
        <div style={{
          ...S.card,
          textAlign: 'center',
          padding: '32px 20px',
          animation: 'fadeIn 0.3s ease',
        }}>
          <div style={{ fontSize: '13px', color: COLORS.textMuted, marginBottom: '8px' }}>
            Was hörst du?
          </div>
          <button
            style={{
              background: COLORS.accentGlow,
              border: `2px solid ${COLORS.accentLight}`,
              borderRadius: '50%',
              width: '80px', height: '80px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '36px', cursor: 'pointer', touchAction: 'manipulation',
              margin: '12px auto',
              transition: 'transform 0.15s',
            }}
            onClick={playQuizAudio}
          >
            🔊
          </button>
          <div style={{ fontSize: '13px', color: COLORS.textDim }}>
            Tippe zum Abspielen
          </div>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
          {quizOptions.map(opt => {
            const isCorrect = opt.id === card.id
            const isSelected = quizAnswered === opt.id
            const showResult = quizAnswered !== null
            let bg = COLORS.surface
            let borderColor = 'rgba(255,255,255,0.08)'
            if (showResult && isCorrect) {
              bg = 'rgba(5, 150, 105, 0.2)'
              borderColor = COLORS.accentLight
            } else if (showResult && isSelected && !isCorrect) {
              bg = 'rgba(239, 68, 68, 0.2)'
              borderColor = COLORS.danger
            }
            return (
              <button
                key={opt.id}
                style={{
                  ...S.card,
                  padding: '16px 20px',
                  cursor: showResult ? 'default' : 'pointer',
                  touchAction: 'manipulation',
                  fontSize: 'clamp(16px, 4vw, 18px)',
                  fontWeight: '600',
                  textAlign: 'left',
                  background: bg,
                  borderColor,
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
                onClick={() => handleQuizAnswer(opt.id)}
              >
                <span style={{ flex: 1 }}>{opt.de}</span>
                {showResult && isCorrect && <span style={{ animation: 'popIn 0.3s ease' }}>✅</span>}
                {showResult && isSelected && !isCorrect && <span style={{ animation: 'shake 0.4s ease' }}>❌</span>}
              </button>
            )
          })}
        </div>

        {/* Bottom Back Button */}
        <button
          style={{ ...S.btn, ...S.btnSecondary, width: '100%' }}
          onClick={() => { finishQuiz() }}
        >
          ← Zurück
        </button>

        {showLevelUp && <LevelUpOverlay level={newLevel} />}
      </div>
    )
  }

  // -- Leaderboard --
  if (screen === 'leaderboard') {
    const medals = ['🥇', '🥈', '🥉']
    return (
      <div style={{ ...S.screen, gap: '16px' }}>
        <h2 style={{ fontSize: 'clamp(22px, 5.5vw, 28px)', fontWeight: '700', textAlign: 'center' }}>
          🏆 Leaderboard
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflow: 'auto' }}>
          {leaderboard.map((entry, i) => {
            const isMe = player && entry.id === player.id
            return (
              <div
                key={entry.id}
                style={{
                  ...S.card,
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
                  border: isMe ? `2px solid ${COLORS.accentLight}` : `1px solid rgba(255,255,255,0.05)`,
                  background: isMe ? 'rgba(52, 211, 153, 0.08)' : COLORS.surface,
                }}
              >
                <div style={{
                  width: '32px',
                  textAlign: 'center',
                  fontSize: i < 3 ? '20px' : '14px',
                  fontWeight: '700',
                  color: i < 3 ? COLORS.gold : COLORS.textMuted,
                }}>
                  {i < 3 ? medals[i] : `${i + 1}.`}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: '600',
                    fontSize: '15px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {entry.name} {isMe && '(Du)'}
                  </div>
                  <div style={{ fontSize: '12px', color: COLORS.textMuted }}>
                    🔥 {entry.streak_count || 0} Tage
                  </div>
                </div>
                <div style={{
                  fontWeight: '700',
                  fontSize: '16px',
                  color: COLORS.gold,
                }}>
                  {entry.xp} XP
                </div>
              </div>
            )
          })}
          {leaderboard.length === 0 && !lbLoading && (
            <div style={{ textAlign: 'center', color: COLORS.textMuted, padding: '40px 0' }}>
              Noch keine Spieler
            </div>
          )}
          {lbLoading && (
            <div style={{ textAlign: 'center', color: COLORS.textMuted, padding: '40px 0', animation: 'pulse 1.5s ease infinite' }}>
              Laden...
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            style={{ ...S.btn, ...S.btnSecondary, flex: 1 }}
            onClick={() => setScreen('home')}
          >
            ← Zurück
          </button>
          <button
            style={{ ...S.btn, ...S.btnSecondary, flex: 1, color: COLORS.accentLight }}
            onClick={loadLeaderboard}
            disabled={lbLoading}
          >
            {lbLoading ? '...' : '↻ Aktualisieren'}
          </button>
        </div>
      </div>
    )
  }

  return null
}

// ============================================================
// LEVEL UP OVERLAY
// ============================================================
function LevelUpOverlay({ level }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease',
    }}>
      <div style={{
        textAlign: 'center',
        animation: 'popIn 0.5s ease',
      }}>
        <div style={{ fontSize: '72px', marginBottom: '16px' }}>🎉</div>
        <h2 style={{
          fontSize: '32px',
          fontWeight: '800',
          background: `linear-gradient(135deg, ${COLORS.gold}, #fcd34d)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Level {level}!
        </h2>
        <p style={{ color: COLORS.textMuted, marginTop: '8px', fontSize: '16px' }}>
          Weiter so! 💪
        </p>
      </div>
    </div>
  )
}

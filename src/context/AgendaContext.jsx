import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from './AuthContext'
import { useCalendar } from '../hooks/useCalendar'

const AgendaContext = createContext(null)

export function useAgenda() {
  const ctx = useContext(AgendaContext)
  if (!ctx) throw new Error('useAgenda debe usarse dentro de <AgendaProvider>')
  return ctx
}

// The hours rendered by the time-blocking grid.
export const HORAS = Array.from({ length: 16 }, (_, i) =>
  String(i + 7).padStart(2, '0') + ':00',
)

// Habits seeded for a fresh day, following the Atomic Habits idea of small,
// identity-based daily actions.
const HABITOS_POR_DEFECTO = [
  { id: 'agua', nombre: 'Beber agua', emoji: '💧' },
  { id: 'mover', nombre: 'Moverme 20 min', emoji: '🏃' },
  { id: 'leer', nombre: 'Leer 10 páginas', emoji: '📖' },
  { id: 'meditar', nombre: 'Respirar 5 min', emoji: '🧘' },
]

// A blank day, used before any data exists in Firestore.
function dayVacio() {
  return {
    priorities: [
      { id: 'p1', text: '', done: false },
      { id: 'p2', text: '', done: false },
      { id: 'p3', text: '', done: false },
    ],
    schedule: {},
    habits: HABITOS_POR_DEFECTO.map((h) => ({ ...h, done: false })),
    journal: { logros: '', gratitud: '', manana: '' },
  }
}

export function AgendaProvider({ children }) {
  const { user } = useAuth()
  const calendar = useCalendar()
  const { key } = calendar

  const [data, setData] = useState(dayVacio())
  const [syncing, setSyncing] = useState(true)

  // Tracks whether we already have a real snapshot, so the first write doesn't
  // race the initial read.
  const hydrated = useRef(false)
  const saveTimer = useRef(null)

  const docRef = useMemo(() => {
    if (!user) return null
    return doc(db, 'users', user.uid, 'days', key)
  }, [user, key])

  // Subscribe to the selected day in real time.
  useEffect(() => {
    if (!docRef) return
    hydrated.current = false
    setSyncing(true)

    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setData({ ...dayVacio(), ...snap.data() })
      } else {
        setData(dayVacio())
      }
      hydrated.current = true
      setSyncing(false)
    })

    return () => {
      unsub()
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [docRef])

  // Persists the whole day document, debounced to avoid a write per keystroke.
  const persist = (nextData) => {
    if (!docRef || !hydrated.current) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      setDoc(docRef, { ...nextData, updatedAt: Date.now() }, { merge: true })
    }, 500)
  }

  // Generic local + remote update.
  const update = (patch) => {
    setData((prev) => {
      const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch }
      persist(next)
      return next
    })
  }

  // ---- Focused mutators used by the dashboard components ----

  const setPriority = (id, fields) =>
    update((prev) => ({
      ...prev,
      priorities: prev.priorities.map((p) =>
        p.id === id ? { ...p, ...fields } : p,
      ),
    }))

  const setScheduleSlot = (hour, text) =>
    update((prev) => ({
      ...prev,
      schedule: { ...prev.schedule, [hour]: text },
    }))

  const toggleHabit = (id) =>
    update((prev) => ({
      ...prev,
      habits: prev.habits.map((h) =>
        h.id === id ? { ...h, done: !h.done } : h,
      ),
    }))

  const setJournal = (field, value) =>
    update((prev) => ({
      ...prev,
      journal: { ...prev.journal, [field]: value },
    }))

  const value = {
    calendar,
    data,
    syncing,
    setPriority,
    setScheduleSlot,
    toggleHabit,
    setJournal,
  }

  return <AgendaContext.Provider value={value}>{children}</AgendaContext.Provider>
}

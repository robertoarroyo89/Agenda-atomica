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
import { HABITOS_POR_ID, ordenHabito } from '../data/catalogoHabitos'

const AgendaContext = createContext(null)

export function useAgenda() {
  const ctx = useContext(AgendaContext)
  if (!ctx) throw new Error('useAgenda debe usarse dentro de <AgendaProvider>')
  return ctx
}

// Las horas que muestra la rejilla de bloques de tiempo.
export const HORAS = Array.from({ length: 16 }, (_, i) =>
  String(i + 7).padStart(2, '0') + ':00',
)

// Un día en blanco. Los hábitos del día solo guardan QUÉ se completó (por id);
// la definición de los hábitos vive en el perfil del usuario.
function dayVacio() {
  return {
    priorities: [
      { id: 'p1', text: '', done: false },
      { id: 'p2', text: '', done: false },
      { id: 'p3', text: '', done: false },
    ],
    schedule: {},
    completados: {},
    journal: { logros: '', gratitud: '', manana: '' },
  }
}

export function AgendaProvider({ children }) {
  const { user } = useAuth()
  const calendar = useCalendar()
  const { key } = calendar

  // ---- Perfil del usuario (hábitos elegidos + estado de onboarding) ----
  const [perfil, setPerfil] = useState(null)
  const [perfilCargando, setPerfilCargando] = useState(true)
  const [mostrarSelectorHabitos, setMostrarSelectorHabitos] = useState(false)

  const perfilRef = useMemo(
    () => (user ? doc(db, 'users', user.uid) : null),
    [user],
  )

  useEffect(() => {
    if (!perfilRef) return
    setPerfilCargando(true)
    const unsub = onSnapshot(perfilRef, (snap) => {
      setPerfil(snap.exists() ? snap.data() : { onboardingCompleto: false, habits: [] })
      setPerfilCargando(false)
    })
    return unsub
  }, [perfilRef])

  const necesitaOnboarding = !perfilCargando && !perfil?.onboardingCompleto

  // Hábitos activos del usuario, resueltos y ordenados como en el catálogo.
  const habitosActivos = useMemo(() => {
    const lista = (perfil?.habits || []).filter((h) => h.activo)
    return [...lista].sort((a, b) => ordenHabito(a.id) - ordenHabito(b.id))
  }, [perfil])

  // Guarda la selección de hábitos. No borra los antiguos: los marca inactivos
  // (soft delete), así el historial de días pasados nunca pierde su definición.
  const guardarHabitos = async (idsSeleccionados) => {
    if (!perfilRef) return
    const previos = perfil?.habits || []
    const prevPorId = Object.fromEntries(previos.map((h) => [h.id, h]))
    const idsUnion = new Set([...previos.map((h) => h.id), ...idsSeleccionados])

    const habits = [...idsUnion].map((id) => {
      const def = HABITOS_POR_ID[id] || prevPorId[id] || { id, nombre: id, emoji: '•' }
      return {
        id,
        nombre: def.nombre,
        emoji: def.emoji,
        categoria: def.categoria || null,
        activo: idsSeleccionados.includes(id),
      }
    })

    await setDoc(
      perfilRef,
      { habits, onboardingCompleto: true, updatedAt: Date.now() },
      { merge: true },
    )
    setMostrarSelectorHabitos(false)
  }

  const abrirEditorHabitos = () => setMostrarSelectorHabitos(true)
  const cerrarEditorHabitos = () => setMostrarSelectorHabitos(false)

  // ---- Datos del día seleccionado ----
  const [data, setData] = useState(dayVacio())
  const [syncing, setSyncing] = useState(true)
  const hydrated = useRef(false)
  const saveTimer = useRef(null)

  const docRef = useMemo(() => {
    if (!user) return null
    return doc(db, 'users', user.uid, 'days', key)
  }, [user, key])

  useEffect(() => {
    if (!docRef) return
    hydrated.current = false
    setSyncing(true)
    const unsub = onSnapshot(docRef, (snap) => {
      setData(snap.exists() ? { ...dayVacio(), ...snap.data() } : dayVacio())
      hydrated.current = true
      setSyncing(false)
    })
    return () => {
      unsub()
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [docRef])

  // Persiste el día con un pequeño retardo para no escribir en cada tecla.
  const persist = (nextData) => {
    if (!docRef || !hydrated.current) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      setDoc(docRef, { ...nextData, updatedAt: Date.now() }, { merge: true })
    }, 500)
  }

  const update = (patch) => {
    setData((prev) => {
      const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch }
      persist(next)
      return next
    })
  }

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

  // Marca o desmarca un hábito como hecho en el día actual.
  const toggleHabit = (id) =>
    update((prev) => ({
      ...prev,
      completados: { ...prev.completados, [id]: !prev.completados?.[id] },
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
    // perfil / hábitos
    perfil,
    perfilCargando,
    necesitaOnboarding,
    habitosActivos,
    completados: data.completados || {},
    guardarHabitos,
    mostrarSelectorHabitos,
    abrirEditorHabitos,
    cerrarEditorHabitos,
    // mutadores del día
    setPriority,
    setScheduleSlot,
    toggleHabit,
    setJournal,
  }

  return <AgendaContext.Provider value={value}>{children}</AgendaContext.Provider>
}

import { useCallback, useMemo, useState } from 'react'

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

// Formats a Date as a local YYYY-MM-DD key (avoids UTC off-by-one).
export function toKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function sameKey(a, b) {
  return toKey(a) === toKey(b)
}

/**
 * Manages the currently selected day plus convenient navigation helpers.
 * All labels are returned in Spanish for direct use in the UI.
 */
export function useCalendar(initial = new Date()) {
  const [date, setDate] = useState(initial)

  const goToDate = useCallback((d) => setDate(new Date(d)), [])

  const shiftDay = useCallback((delta) => {
    setDate((prev) => {
      const next = new Date(prev)
      next.setDate(next.getDate() + delta)
      return next
    })
  }, [])

  const next = useCallback(() => shiftDay(1), [shiftDay])
  const prev = useCallback(() => shiftDay(-1), [shiftDay])
  const today = useCallback(() => setDate(new Date()), [])

  const key = useMemo(() => toKey(date), [date])
  const isToday = useMemo(() => sameKey(date, new Date()), [date])

  // "lunes" / "12 de junio"
  const weekday = DIAS[date.getDay()]
  const longLabel = `${date.getDate()} de ${MESES[date.getMonth()]}`
  const fullLabel = `${weekday}, ${longLabel}`

  // Day-of-year, used to pick a deterministic daily quote.
  const dayOfYear = useMemo(() => {
    const start = new Date(date.getFullYear(), 0, 0)
    const diff = date - start
    return Math.floor(diff / 86400000)
  }, [date])

  return {
    date,
    key,
    isToday,
    weekday,
    longLabel,
    fullLabel,
    dayOfYear,
    setDate: goToDate,
    next,
    prev,
    today,
  }
}

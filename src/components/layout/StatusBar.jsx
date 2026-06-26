import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, LogOut, RefreshCw } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useAgenda } from '../../context/AgendaContext'

export default function StatusBar() {
  const { user, cerrarSesion } = useAuth()
  const { calendar, syncing } = useAgenda()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const inicial = (user?.displayName || user?.email || '?').trim()[0]?.toUpperCase()

  return (
    <header className="sticky top-0 z-30 border-b border-white/30 bg-white/70 pt-safe backdrop-blur-2xl">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 pb-3">
        {/* Date navigator */}
        <div className="flex items-center gap-1">
          <button
            onClick={calendar.prev}
            aria-label="Día anterior"
            className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition-all duration-300 ease-ios active:scale-90 active:bg-zinc-100"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
          </button>

          <button
            onClick={calendar.today}
            className="min-w-[140px] text-center transition-transform duration-300 ease-ios active:scale-95"
          >
            <p className="text-[17px] font-bold capitalize tracking-tight text-zinc-900">
              {calendar.isToday ? 'Hoy' : calendar.weekday}
            </p>
            <p className="text-[12px] capitalize text-zinc-400">
              {calendar.longLabel}
            </p>
          </button>

          <button
            onClick={calendar.next}
            aria-label="Día siguiente"
            className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition-all duration-300 ease-ios active:scale-90 active:bg-zinc-100"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2.4} />
          </button>
        </div>

        {/* Profile */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-ios-indigo to-ios-blue text-[15px] font-bold text-white shadow-card transition-transform duration-300 ease-ios active:scale-90"
          >
            {inicial}
          </button>

          {open && (
            <div className="absolute right-0 top-12 w-60 origin-top-right animate-pop-in rounded-3xl border border-white/40 bg-white/80 p-2 shadow-float backdrop-blur-2xl">
              <div className="px-3 py-2">
                <p className="truncate text-[15px] font-semibold text-zinc-900">
                  {user?.displayName || 'Tu cuenta'}
                </p>
                <p className="truncate text-[13px] text-zinc-400">{user?.email}</p>
              </div>
              <div className="my-1 h-px bg-zinc-200/70" />
              <div className="flex items-center gap-2 px-3 py-2 text-[13px] text-zinc-400">
                <RefreshCw
                  className={`h-3.5 w-3.5 ${syncing ? 'animate-spin text-ios-blue' : 'text-ios-green'}`}
                />
                {syncing ? 'Sincronizando…' : 'Guardado en la nube'}
              </div>
              <button
                onClick={cerrarSesion}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] font-medium text-ios-red transition-colors active:bg-ios-red/10"
              >
                <LogOut className="h-[18px] w-[18px]" strokeWidth={2} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

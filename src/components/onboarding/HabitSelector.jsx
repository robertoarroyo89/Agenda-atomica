import { useState } from 'react'
import { Check, X, Sparkles, Loader2 } from 'lucide-react'
import {
  CATEGORIAS,
  SELECCION_SUGERIDA,
  HABITOS_RECOMENDADOS,
  HABITOS_MAXIMO,
} from '../../data/catalogoHabitos'
import { useAgenda } from '../../context/AgendaContext'

export default function HabitSelector() {
  const { perfil, guardarHabitos, necesitaOnboarding, cerrarEditorHabitos } =
    useAgenda()

  const esOnboarding = necesitaOnboarding

  // Selección inicial: en edición, los hábitos activos; la primera vez, la sugerida.
  const inicial = esOnboarding
    ? SELECCION_SUGERIDA
    : (perfil?.habits || []).filter((h) => h.activo).map((h) => h.id)

  const [seleccion, setSeleccion] = useState(new Set(inicial))
  const [guardando, setGuardando] = useState(false)
  const [aviso, setAviso] = useState('')

  const total = seleccion.size
  const lleno = total >= HABITOS_MAXIMO

  const alternar = (id) => {
    setSeleccion((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        setAviso('')
      } else if (next.size >= HABITOS_MAXIMO) {
        setAviso(`Empieza con pocos: máximo ${HABITOS_MAXIMO} a la vez.`)
        return prev
      } else {
        next.add(id)
        setAviso('')
      }
      return next
    })
  }

  const guardar = async () => {
    if (total === 0) return
    setGuardando(true)
    await guardarHabitos([...seleccion])
    setGuardando(false)
  }

  return (
    <div className="min-h-screen">
      {/* Cabecera fija con título y contador */}
      <header className="sticky top-0 z-20 border-b border-white/30 bg-white/70 pt-safe backdrop-blur-2xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 pb-3">
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-zinc-900">
              {esOnboarding ? 'Elige tus hábitos' : 'Editar hábitos'}
            </h1>
            <p className="text-[13px] font-medium text-zinc-400">
              {total} de {HABITOS_RECOMENDADOS} recomendados
            </p>
          </div>

          {!esOnboarding && (
            <button
              onClick={cerrarEditorHabitos}
              aria-label="Cancelar"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition-all duration-300 ease-ios active:scale-90"
            >
              <X className="h-5 w-5" strokeWidth={2.4} />
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 pb-36 pt-4">
        {esOnboarding && (
          <div className="mb-5 flex items-start gap-3 rounded-3xl border border-white/40 bg-white/70 p-4 shadow-card backdrop-blur-2xl">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-ios-orange" />
            <p className="text-[14px] leading-relaxed text-zinc-600">
              Empieza con pocos hábitos. Cuando se vuelvan automáticos, añade más.
              Puedes cambiarlos cuando quieras.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {CATEGORIAS.map((cat) => (
            <section key={cat.id}>
              <h2 className="mb-2 px-1 text-[13px] font-semibold uppercase tracking-widest text-zinc-400">
                {cat.nombre}
              </h2>
              <div className="overflow-hidden rounded-3xl border border-white/40 bg-white/70 shadow-card backdrop-blur-2xl">
                {cat.habitos.map((h, i) => {
                  const elegido = seleccion.has(h.id)
                  const bloqueado = lleno && !elegido
                  return (
                    <button
                      key={h.id}
                      onClick={() => alternar(h.id)}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-all duration-300 ease-ios active:bg-zinc-100/60 ${
                        i !== 0 ? 'border-t border-zinc-100' : ''
                      } ${bloqueado ? 'opacity-40' : ''}`}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[18px]">
                        {h.emoji}
                      </span>
                      <span
                        className={`flex-1 text-[16px] ${
                          elegido
                            ? 'font-semibold text-zinc-900'
                            : 'font-medium text-zinc-600'
                        }`}
                      >
                        {h.nombre}
                      </span>
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ease-ios ${
                          elegido
                            ? 'border-ios-green bg-ios-green'
                            : 'border-zinc-300'
                        }`}
                      >
                        <Check
                          className={`h-4 w-4 text-white transition-opacity duration-300 ${
                            elegido ? 'opacity-100' : 'opacity-0'
                          }`}
                          strokeWidth={3}
                        />
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Barra inferior fija con el botón guardar */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/30 bg-white/70 pb-safe backdrop-blur-2xl">
        <div className="mx-auto max-w-2xl px-5 pt-3">
          {aviso && (
            <p className="mb-2 text-center text-[13px] font-medium text-ios-orange">
              {aviso}
            </p>
          )}
          <button
            onClick={guardar}
            disabled={total === 0 || guardando}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-900 py-3.5 text-[16px] font-semibold text-white shadow-float transition-all duration-300 ease-ios active:scale-[0.97] disabled:opacity-40"
          >
            {guardando && <Loader2 className="h-4 w-4 animate-spin" />}
            {esOnboarding
              ? total === 0
                ? 'Elige al menos uno'
                : `Empezar con ${total} ${total === 1 ? 'hábito' : 'hábitos'}`
              : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}

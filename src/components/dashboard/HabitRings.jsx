import { Check, Plus } from 'lucide-react'
import { useAgenda } from '../../context/AgendaContext'

export default function HabitRings() {
  const { habitosActivos, completados, toggleHabit, abrirEditorHabitos } =
    useAgenda()

  const hechos = habitosActivos.filter((h) => completados[h.id]).length
  const total = habitosActivos.length || 1
  const progreso = hechos / total

  // Geometría del anillo
  const size = 72
  const stroke = 8
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c * (1 - progreso)

  const completo = habitosActivos.length > 0 && hechos === habitosActivos.length

  return (
    <section className="rounded-[28px] border border-white/40 bg-white/70 p-5 shadow-card backdrop-blur-2xl">
      <div className="mb-5 flex items-center gap-4">
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e5ea" strokeWidth={stroke} />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="url(#habitGrad)"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.25,0.1,0.25,1)' }}
            />
            <defs>
              <linearGradient id="habitGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#30D158" />
                <stop offset="100%" stopColor="#0A84FF" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[18px] font-bold tabular-nums text-zinc-900">{hechos}</span>
            <span className="-mt-1 text-[11px] font-medium text-zinc-400">
              de {habitosActivos.length}
            </span>
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-[20px] font-bold tracking-tight text-zinc-900">Hábitos de hoy</h2>
          <p className="text-[13px] font-medium text-zinc-400">
            {completo ? '¡Día completo! Sigue la racha.' : 'Pequeños votos por quien quieres ser.'}
          </p>
        </div>

        <button
          onClick={abrirEditorHabitos}
          className="self-start rounded-full bg-zinc-100 px-3 py-1.5 text-[13px] font-semibold text-zinc-600 transition-all duration-300 ease-ios active:scale-90"
        >
          Editar
        </button>
      </div>

      {habitosActivos.length === 0 ? (
        <button
          onClick={abrirEditorHabitos}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-zinc-200 py-6 text-[15px] font-semibold text-zinc-400 transition-all duration-300 ease-ios active:scale-[0.98]"
        >
          <Plus className="h-5 w-5" strokeWidth={2.4} />
          Añade tus hábitos
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {habitosActivos.map((h) => {
            const done = !!completados[h.id]
            return (
              <button
                key={h.id}
                onClick={() => toggleHabit(h.id)}
                className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-all duration-300 ease-ios active:scale-[0.96] ${
                  done ? 'border-ios-green/30 bg-ios-green/10' : 'border-transparent bg-zinc-100/70'
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[18px] transition-all duration-300 ease-ios ${
                    done ? 'bg-ios-green' : 'bg-white'
                  }`}
                >
                  {done ? <Check className="h-5 w-5 text-white" strokeWidth={3} /> : <span>{h.emoji || '•'}</span>}
                </span>
                <span className={`text-[14px] font-semibold leading-tight ${done ? 'text-ios-green' : 'text-zinc-700'}`}>
                  {h.nombre}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}

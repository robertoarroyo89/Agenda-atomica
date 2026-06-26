import { Check } from 'lucide-react'
import { useAgenda } from '../../context/AgendaContext'

export default function HabitRings() {
  const { data, toggleHabit } = useAgenda()
  const habitos = data.habits || []
  const hechos = habitos.filter((h) => h.done).length
  const total = habitos.length || 1
  const progreso = hechos / total

  // SVG ring geometry
  const size = 72
  const stroke = 8
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c * (1 - progreso)

  const completo = hechos === habitos.length && habitos.length > 0

  return (
    <section className="rounded-[28px] border border-white/40 bg-white/70 p-5 shadow-card backdrop-blur-2xl">
      <div className="mb-5 flex items-center gap-4">
        {/* Progress ring */}
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="#e5e5ea"
              strokeWidth={stroke}
            />
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
              style={{
                transition: 'stroke-dashoffset 0.6s cubic-bezier(0.25,0.1,0.25,1)',
              }}
            />
            <defs>
              <linearGradient id="habitGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#30D158" />
                <stop offset="100%" stopColor="#0A84FF" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[18px] font-bold tabular-nums text-zinc-900">
              {hechos}
            </span>
            <span className="-mt-1 text-[11px] font-medium text-zinc-400">
              de {habitos.length}
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-[20px] font-bold tracking-tight text-zinc-900">
            Hábitos de hoy
          </h2>
          <p className="text-[13px] font-medium text-zinc-400">
            {completo
              ? '¡Día completo! Sigue la racha.'
              : 'Pequeños votos por quien quieres ser.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {habitos.map((h) => (
          <button
            key={h.id}
            onClick={() => toggleHabit(h.id)}
            className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-all duration-300 ease-ios active:scale-[0.96] ${
              h.done
                ? 'border-ios-green/30 bg-ios-green/10'
                : 'border-transparent bg-zinc-100/70'
            }`}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[18px] transition-all duration-300 ease-ios ${
                h.done ? 'bg-ios-green' : 'bg-white'
              }`}
            >
              {h.done ? (
                <Check className="h-5 w-5 text-white" strokeWidth={3} />
              ) : (
                <span>{h.emoji || '•'}</span>
              )}
            </span>
            <span
              className={`text-[14px] font-semibold leading-tight ${
                h.done ? 'text-ios-green' : 'text-zinc-700'
              }`}
            >
              {h.nombre}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

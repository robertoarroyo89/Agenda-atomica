import { Check } from 'lucide-react'
import { useAgenda } from '../../context/AgendaContext'

export default function TopPriorities() {
  const { data, setPriority } = useAgenda()

  return (
    <section className="rounded-[28px] border border-white/40 bg-white/70 p-5 shadow-card backdrop-blur-2xl">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-[20px] font-bold tracking-tight text-zinc-900">
          Las 3 de hoy
        </h2>
        <span className="text-[13px] font-medium text-zinc-400">
          Lo que de verdad importa
        </span>
      </div>

      <div className="space-y-2.5">
        {data.priorities.map((p, i) => (
          <div
            key={p.id}
            className="flex items-center gap-3 rounded-2xl bg-zinc-100/70 px-3 py-3 transition-all duration-300 ease-ios focus-within:bg-white focus-within:ring-2 focus-within:ring-ios-blue/20"
          >
            <button
              onClick={() => setPriority(p.id, { done: !p.done })}
              aria-label={p.done ? 'Marcar como pendiente' : 'Marcar como hecho'}
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ease-ios active:scale-90 ${
                p.done
                  ? 'border-ios-green bg-ios-green'
                  : 'border-zinc-300 bg-transparent'
              }`}
            >
              <Check
                className={`h-4 w-4 text-white transition-opacity duration-300 ${
                  p.done ? 'opacity-100' : 'opacity-0'
                }`}
                strokeWidth={3}
              />
            </button>

            <span className="text-[13px] font-bold text-zinc-300">{i + 1}</span>

            <input
              value={p.text}
              onChange={(e) => setPriority(p.id, { text: e.target.value })}
              placeholder="Escribe una prioridad…"
              className={`w-full bg-transparent text-[16px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none ${
                p.done ? 'text-zinc-400 line-through' : ''
              }`}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

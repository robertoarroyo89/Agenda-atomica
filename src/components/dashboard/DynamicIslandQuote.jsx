import { Quote } from 'lucide-react'
import { useAgenda } from '../../context/AgendaContext'
import { leccionDelDia } from '../../data/leccionesAtomicas'

export default function DynamicIslandQuote() {
  const { calendar } = useAgenda()
  // Una lección distinta por cada día del año (1–366), sin repeticiones.
  const leccion = leccionDelDia(calendar.dayOfYear)

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 p-6 shadow-float">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-ios-orange/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-ios-indigo/20 blur-3xl" />

      <div className="relative">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl">
            <Quote className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
          </span>
          <span className="text-[12px] font-semibold uppercase tracking-widest text-white/50">
            {leccion.tema}
          </span>
        </div>

        <p className="text-[18px] font-semibold leading-snug tracking-tight text-white">
          {leccion.texto}
        </p>

        <p className="mt-4 text-[13px] font-medium text-white/40">
          Hábitos Atómicos · James Clear
        </p>
      </div>
    </div>
  )
}

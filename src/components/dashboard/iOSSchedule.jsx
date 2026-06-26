import { useAgenda, HORAS } from '../../context/AgendaContext'

export default function IOSSchedule() {
  const { data, setScheduleSlot, calendar } = useAgenda()

  const ahora = new Date()
  const horaActual = `${String(ahora.getHours()).padStart(2, '0')}:00`

  return (
    <section className="rounded-[28px] border border-white/40 bg-white/70 p-5 shadow-card backdrop-blur-2xl">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-[20px] font-bold tracking-tight text-zinc-900">
          Horario
        </h2>
        <span className="text-[13px] font-medium text-zinc-400">
          Bloquea tu tiempo
        </span>
      </div>

      <div className="divide-y divide-zinc-100">
        {HORAS.map((hora) => {
          const activa = hora === horaActual && calendar.isToday
          return (
            <div
              key={hora}
              className="group flex items-center gap-3 py-1.5 transition-colors"
            >
              <span
                className={`w-12 shrink-0 text-right text-[13px] font-semibold tabular-nums ${
                  activa ? 'text-ios-blue' : 'text-zinc-400'
                }`}
              >
                {hora}
              </span>

              <div className="relative flex-1">
                {activa && (
                  <span className="absolute -left-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-ios-blue" />
                )}
                <input
                  value={data.schedule?.[hora] || ''}
                  onChange={(e) => setScheduleSlot(hora, e.target.value)}
                  placeholder="—"
                  className="w-full rounded-xl bg-transparent px-2 py-1.5 text-[15px] text-zinc-900 placeholder:text-zinc-300 transition-all duration-300 ease-ios focus:bg-zinc-100/80 focus:outline-none focus:ring-2 focus:ring-ios-blue/20"
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

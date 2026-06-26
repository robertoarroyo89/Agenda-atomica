import { Sun, ListChecks, Clock, NotebookPen } from 'lucide-react'

export const TABS = [
  { id: 'enfoque', label: 'Enfoque', icon: Sun },
  { id: 'habitos', label: 'Hábitos', icon: ListChecks },
  { id: 'horario', label: 'Horario', icon: Clock },
  { id: 'diario', label: 'Diario', icon: NotebookPen },
]

export default function TabBar({ active, onChange }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 pb-safe">
      <div className="mx-auto mb-3 flex max-w-md items-center justify-between gap-1 rounded-[26px] border border-white/40 bg-white/70 px-2 py-2 shadow-tab backdrop-blur-2xl">
        {TABS.map(({ id, label, icon: Icon }) => {
          const selected = active === id
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="relative flex flex-1 flex-col items-center gap-0.5 rounded-[20px] py-1.5 transition-all duration-300 ease-ios active:scale-90"
            >
              {selected && (
                <span className="absolute inset-0 rounded-[20px] bg-gradient-to-b from-zinc-900 to-zinc-800 shadow-card" />
              )}
              <Icon
                className={`relative h-[22px] w-[22px] transition-colors duration-300 ${
                  selected ? 'text-white' : 'text-zinc-400'
                }`}
                strokeWidth={selected ? 2.4 : 2}
              />
              <span
                className={`relative text-[10px] font-semibold transition-colors duration-300 ${
                  selected ? 'text-white' : 'text-zinc-400'
                }`}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

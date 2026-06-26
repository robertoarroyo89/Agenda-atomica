import { useAgenda } from '../../context/AgendaContext'

const CAMPOS = [
  {
    key: 'logros',
    titulo: 'Logros de hoy',
    placeholder: '¿De qué estás orgulloso/a hoy?',
    emoji: '🏆',
  },
  {
    key: 'gratitud',
    titulo: 'Gratitud',
    placeholder: 'Tres cosas que agradeces…',
    emoji: '🙏',
  },
  {
    key: 'manana',
    titulo: 'Para mañana',
    placeholder: 'Una idea, una intención, un primer paso…',
    emoji: '🌅',
  },
]

function AutoTextarea({ value, onChange, placeholder }) {
  // Grows with content for an iOS Notes feel.
  const onInput = (e) => {
    e.target.style.height = 'auto'
    e.target.style.height = `${e.target.scrollHeight}px`
    onChange(e.target.value)
  }
  return (
    <textarea
      value={value}
      onChange={onInput}
      placeholder={placeholder}
      rows={2}
      className="w-full resize-none bg-transparent text-[16px] leading-relaxed text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
    />
  )
}

export default function JournalReflection() {
  const { data, setJournal } = useAgenda()
  const journal = data.journal || {}

  return (
    <section className="space-y-3">
      {CAMPOS.map((campo) => (
        <div
          key={campo.key}
          className="rounded-[28px] border border-white/40 bg-white/70 p-5 shadow-card backdrop-blur-2xl transition-all duration-300 ease-ios focus-within:bg-white/85"
        >
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[18px]">{campo.emoji}</span>
            <h3 className="text-[17px] font-bold tracking-tight text-zinc-900">
              {campo.titulo}
            </h3>
          </div>
          <AutoTextarea
            value={journal[campo.key] || ''}
            placeholder={campo.placeholder}
            onChange={(v) => setJournal(campo.key, v)}
          />
        </div>
      ))}
    </section>
  )
}

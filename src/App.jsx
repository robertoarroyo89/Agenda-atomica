import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useAuth } from './context/AuthContext'
import { AgendaProvider, useAgenda } from './context/AgendaContext'
import IOSAuthScreen from './components/auth/iOSAuthScreen'
import HabitSelector from './components/onboarding/HabitSelector'
import StatusBar from './components/layout/StatusBar'
import TabBar from './components/layout/TabBar'
import DynamicIslandQuote from './components/dashboard/DynamicIslandQuote'
import TopPriorities from './components/dashboard/TopPriorities'
import IOSSchedule from './components/dashboard/iOSSchedule'
import HabitRings from './components/dashboard/HabitRings'
import JournalReflection from './components/dashboard/JournalReflection'

function Splash() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-7 w-7 animate-spin text-zinc-300" />
    </div>
  )
}

function Dashboard() {
  const [tab, setTab] = useState('enfoque')

  return (
    <div className="min-h-screen">
      <StatusBar />
      <main className="mx-auto max-w-2xl px-4 pb-28 pt-4">
        <div className="mb-4">
          <DynamicIslandQuote />
        </div>
        <div key={tab} className="animate-sheet-up space-y-4">
          {tab === 'enfoque' && (
            <>
              <TopPriorities />
              <HabitRings />
            </>
          )}
          {tab === 'habitos' && <HabitRings />}
          {tab === 'horario' && <IOSSchedule />}
          {tab === 'diario' && <JournalReflection />}
        </div>
      </main>
      <TabBar active={tab} onChange={setTab} />
    </div>
  )
}

// Decide qué mostrar una vez hay sesión: carga, onboarding, editor o panel.
function Root() {
  const { perfil, perfilCargando, necesitaOnboarding, mostrarSelectorHabitos } =
    useAgenda()

  if (perfilCargando) return <Splash />

  // La lectura de Firestore falló (normalmente, reglas sin actualizar).
  if (perfil?.error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md rounded-[28px] border border-white/40 bg-white/80 p-6 text-center shadow-card backdrop-blur-2xl">
          <p className="text-[40px]">🔒</p>
          <h1 className="mt-2 text-[20px] font-bold tracking-tight text-zinc-900">
            No se puede acceder a tus datos
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-zinc-500">
            Revisa las reglas de Firestore en la consola de Firebase (Firestore →
            Reglas) y pulsa Publicar. Después recarga esta página.
          </p>
          <p className="mt-3 text-[12px] text-zinc-300">Código: {perfil.error}</p>
        </div>
      </div>
    )
  }

  if (necesitaOnboarding || mostrarSelectorHabitos) return <HabitSelector />
  return <Dashboard />
}

export default function App() {
  const { user, loading } = useAuth()

  if (loading) return <Splash />
  if (!user) return <IOSAuthScreen />

  return (
    <AgendaProvider>
      <Root />
    </AgendaProvider>
  )
}

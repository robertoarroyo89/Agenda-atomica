import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useAuth } from './context/AuthContext'
import { AgendaProvider } from './context/AgendaContext'
import IOSAuthScreen from './components/auth/iOSAuthScreen'
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
        {/* The daily lesson stays pinned above every section. */}
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

export default function App() {
  const { user, loading } = useAuth()

  if (loading) return <Splash />
  if (!user) return <IOSAuthScreen />

  return (
    <AgendaProvider>
      <Dashboard />
    </AgendaProvider>
  )
}

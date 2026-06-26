import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { firebaseConfigurado } from './config/firebase.js'
import './index.css'

// Aviso claro cuando faltan las variables de entorno de Firebase (causa
// habitual de la "pantalla en blanco" tras desplegar en Vercel).
function ConfigPendiente() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-[28px] border border-white/40 bg-white/80 p-6 text-center shadow-card backdrop-blur-2xl">
        <p className="text-[40px]">🔌</p>
        <h1 className="mt-2 text-[20px] font-bold tracking-tight text-zinc-900">
          Falta conectar Firebase
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-zinc-500">
          No se han encontrado las variables de entorno. En Vercel ve a
          <span className="font-semibold text-zinc-700">
            {' '}Settings → Environment Variables
          </span>
          , añade las claves <code className="text-zinc-700">VITE_FIREBASE_*</code> y
          vuelve a desplegar.
        </p>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      {firebaseConfigurado ? (
        <AuthProvider>
          <App />
        </AuthProvider>
      ) : (
        <ConfigPendiente />
      )}
    </ErrorBoundary>
  </React.StrictMode>,
)

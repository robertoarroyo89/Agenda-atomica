import { useState } from 'react'
import { Mail, Lock, User, Loader2, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function IOSAuthScreen() {
  const { iniciarSesion, registrar, entrarConGoogle } = useAuth()
  const [modo, setModo] = useState('login') // 'login' | 'registro'
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const esRegistro = modo === 'registro'

  const enviar = async () => {
    setError('')
    setCargando(true)
    const res = esRegistro
      ? await registrar(email.trim(), password, nombre.trim())
      : await iniciarSesion(email.trim(), password)
    if (!res.ok) setError(res.error)
    setCargando(false)
  }

  const conGoogle = async () => {
    setError('')
    setCargando(true)
    const res = await entrarConGoogle()
    if (!res.ok) setError(res.error)
    setCargando(false)
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient blurred gradient field behind the glass card. */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-ios-indigo/40 blur-3xl" />
        <div className="absolute top-1/3 -right-16 h-80 w-80 rounded-full bg-ios-orange/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-ios-blue/30 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-6 pt-safe pb-safe">
        <div className="w-full max-w-sm animate-sheet-up">
          {/* Brand mark */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[20px] bg-zinc-900 shadow-float">
              <Sparkles className="h-8 w-8 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Agenda Atómica
            </h1>
            <p className="mt-1 text-[15px] text-zinc-500">
              Pequeños hábitos, grandes resultados.
            </p>
          </div>

          {/* Glass card */}
          <div className="rounded-[28px] border border-white/40 bg-white/70 p-6 shadow-card backdrop-blur-2xl">
            <div className="space-y-3">
              {esRegistro && (
                <Field
                  icon={User}
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={setNombre}
                  type="text"
                />
              )}
              <Field
                icon={Mail}
                placeholder="Correo electrónico"
                value={email}
                onChange={setEmail}
                type="email"
              />
              <Field
                icon={Lock}
                placeholder="Contraseña"
                value={password}
                onChange={setPassword}
                type="password"
                onEnter={enviar}
              />
            </div>

            {error && (
              <p className="mt-3 text-center text-[13px] font-medium text-ios-red">
                {error}
              </p>
            )}

            <button
              onClick={enviar}
              disabled={cargando}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-900 py-3.5 text-[16px] font-semibold text-white shadow-float transition-all duration-300 ease-ios active:scale-[0.97] disabled:opacity-60"
            >
              {cargando && <Loader2 className="h-4 w-4 animate-spin" />}
              {esRegistro ? 'Crear cuenta' : 'Entrar'}
            </button>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-zinc-200" />
              <span className="text-[12px] font-medium uppercase tracking-wide text-zinc-400">
                o
              </span>
              <span className="h-px flex-1 bg-zinc-200" />
            </div>

            <button
              onClick={conGoogle}
              disabled={cargando}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-zinc-200 bg-white py-3.5 text-[16px] font-semibold text-zinc-800 transition-all duration-300 ease-ios active:scale-[0.97] disabled:opacity-60"
            >
              <GoogleGlyph />
              Continuar con Google
            </button>
          </div>

          <button
            onClick={() => {
              setModo(esRegistro ? 'login' : 'registro')
              setError('')
            }}
            className="mt-6 w-full text-center text-[15px] text-zinc-500 transition-colors active:text-zinc-700"
          >
            {esRegistro ? (
              <>
                ¿Ya tienes cuenta?{' '}
                <span className="font-semibold text-ios-blue">Inicia sesión</span>
              </>
            ) : (
              <>
                ¿Aún no tienes cuenta?{' '}
                <span className="font-semibold text-ios-blue">Regístrate</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ icon: Icon, placeholder, value, onChange, type, onEnter }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-zinc-100/80 px-4 py-3.5 transition-all duration-300 ease-ios focus-within:bg-white focus-within:ring-2 focus-within:ring-ios-blue/30">
      <Icon className="h-[18px] w-[18px] shrink-0 text-zinc-400" strokeWidth={2} />
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onEnter?.()}
        className="w-full bg-transparent text-[16px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
      />
    </div>
  )
}

function GoogleGlyph() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  )
}

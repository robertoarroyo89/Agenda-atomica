import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { auth, googleProvider } from '../config/firebase'

const AuthContext = createContext(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}

// Traduce los códigos de error de Firebase a mensajes en español.
// Si el código no está mapeado, lo muestra entre paréntesis para diagnóstico.
function traducirError(code) {
  const mapa = {
    'auth/invalid-email': 'El correo no tiene un formato válido.',
    'auth/user-disabled': 'Esta cuenta está deshabilitada.',
    'auth/user-not-found': 'No existe ninguna cuenta con ese correo.',
    'auth/wrong-password': 'La contraseña es incorrecta.',
    'auth/invalid-credential': 'Correo o contraseña incorrectos.',
    'auth/email-already-in-use': 'Ya existe una cuenta con ese correo.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth/missing-password': 'Escribe una contraseña.',
    'auth/popup-closed-by-user': 'Has cerrado la ventana antes de terminar.',
    'auth/popup-blocked': 'El navegador ha bloqueado la ventana emergente.',
    'auth/cancelled-popup-request': 'Se canceló el intento anterior. Prueba de nuevo.',
    'auth/too-many-requests': 'Demasiados intentos. Inténtalo más tarde.',
    'auth/network-request-failed': 'Sin conexión. Revisa tu red e inténtalo otra vez.',
    'auth/operation-not-allowed':
      'Este método de acceso no está activado en Firebase (Authentication → Sign-in method).',
    'auth/unauthorized-domain':
      'Este dominio no está autorizado en Firebase (Authentication → Settings → Authorized domains).',
    'auth/invalid-api-key': 'La clave de Firebase no es válida. Revisa las variables en Vercel.',
  }
  if (mapa[code]) return mapa[code]
  return `Algo ha fallado. Vuelve a intentarlo. (${code || 'desconocido'})`
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  const registrar = async (email, password, nombre) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      if (nombre) await updateProfile(cred.user, { displayName: nombre })
      return { ok: true }
    } catch (e) {
      console.error('[Auth] registrar:', e.code, e.message)
      return { ok: false, error: traducirError(e.code) }
    }
  }

  const iniciarSesion = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { ok: true }
    } catch (e) {
      console.error('[Auth] iniciarSesion:', e.code, e.message)
      return { ok: false, error: traducirError(e.code) }
    }
  }

  const entrarConGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      return { ok: true }
    } catch (e) {
      console.error('[Auth] entrarConGoogle:', e.code, e.message)
      return { ok: false, error: traducirError(e.code) }
    }
  }

  const cerrarSesion = () => signOut(auth)

  const value = {
    user,
    loading,
    registrar,
    iniciarSesion,
    entrarConGoogle,
    cerrarSesion,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

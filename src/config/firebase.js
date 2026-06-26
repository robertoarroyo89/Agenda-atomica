import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Todos los valores vienen del archivo .env (ver .env.example) y, en
// producción, de las Environment Variables del panel de Vercel.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// ¿Están presentes las claves imprescindibles? Si faltan (típico cuando no se
// han configurado las variables en Vercel), evitamos inicializar Firebase para
// que la app no se rompa con una pantalla en blanco.
const REQUERIDAS = ['apiKey', 'authDomain', 'projectId', 'appId']
export const firebaseConfigurado = REQUERIDAS.every((k) => !!firebaseConfig[k])

let app = null
let auth = null
let db = null
let googleProvider = null

if (firebaseConfigurado) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  googleProvider = new GoogleAuthProvider()
} else {
  console.error(
    '[Firebase] Faltan variables de entorno VITE_FIREBASE_*. ' +
      'Configúralas en Vercel (Settings → Environment Variables) y vuelve a desplegar.',
  )
}

export { auth, db, googleProvider }
export default app

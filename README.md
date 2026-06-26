# Agenda Atómica

Agenda diaria premium con estética **iOS 26** (glassmorphism, blur dinámico,
transiciones spring) y metodología **Hábitos Atómicos** de James Clear.
Interfaz íntegramente en español. Stack: **React + Vite + Tailwind + Firebase**.

## Puesta en marcha

```bash
npm install
cp .env.example .env   # rellena tus credenciales de Firebase
npm run dev
```

## Configurar Firebase

1. Crea un proyecto en [console.firebase.google.com](https://console.firebase.google.com).
2. **Authentication → Sign-in method**: activa *Correo/contraseña* y *Google*.
3. **Firestore Database**: crea la base de datos en modo producción.
4. **Project settings → Tus apps → Web**: copia las claves al archivo `.env`.

### Reglas de seguridad de Firestore

Cada usuario solo puede leer y escribir sus propios días:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Documento de perfil (hábitos elegidos, onboarding).
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
      // Documentos por día.
      match /days/{dayId} {
        allow read, write: if request.auth != null
                           && request.auth.uid == userId;
      }
    }
  }
}
```

## Modelo de datos

Perfil del usuario, con los hábitos que sigue (no se borran al editar: se
marcan inactivos, así el historial nunca pierde su definición):

```
users/{uid}
  onboardingCompleto: true
  habits: [{ id, nombre, emoji, categoria, activo }]
```

Un documento por día, con clave `YYYY-MM-DD`:

```
users/{uid}/days/{2026-06-26}
  priorities:   [{ id, text, done }]   // las 3 prioridades
  schedule:     { "07:00": "...", ... }// bloques horarios
  completados:  { agua: true, ... }    // qué hábitos se cumplieron ese día
  journal:      { logros, gratitud, manana }
  updatedAt:    number
```

Los cambios se guardan solos (escritura con *debounce* de 500 ms) y se
sincronizan en tiempo real entre dispositivos vía `onSnapshot`.

## Estructura

```
src/
├── config/firebase.js          Inicialización de Firebase
├── context/
│   ├── AuthContext.jsx          Estado global de autenticación
│   └── AgendaContext.jsx        Sincronización en tiempo real con Firestore
├── components/
│   ├── layout/                  StatusBar · TabBar
│   ├── dashboard/               Cita · Prioridades · Horario · Hábitos · Diario
│   └── auth/iOSAuthScreen.jsx   Pantalla de acceso
├── hooks/useCalendar.js         Navegación de fechas (YYYY-MM-DD)
├── App.jsx
└── main.jsx
```

## Scripts

| Comando           | Acción                          |
| ----------------- | ------------------------------- |
| `npm run dev`     | Servidor de desarrollo          |
| `npm run build`   | Build de producción en `dist/`  |
| `npm run preview` | Previsualiza el build           |

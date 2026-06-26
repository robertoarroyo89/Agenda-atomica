// Catálogo de hábitos para el onboarding, agrupados por categoría.
// Cada hábito tiene un id estable (no cambiar: es la clave en Firestore).

export const CATEGORIAS = [
  {
    id: 'salud',
    nombre: 'Salud',
    habitos: [
      { id: 'agua', nombre: 'Beber 2 litros de agua', emoji: '💧' },
      { id: 'mover', nombre: 'Moverme 20 min', emoji: '🏃' },
      { id: 'dormir', nombre: 'Dormir 8 horas', emoji: '😴' },
      { id: 'fruta', nombre: 'Comer fruta o verdura', emoji: '🥗' },
      { id: 'estirar', nombre: 'Estirar al levantarme', emoji: '🤸' },
      { id: 'pasos', nombre: 'Andar 10.000 pasos', emoji: '👟' },
    ],
  },
  {
    id: 'mente',
    nombre: 'Mente',
    habitos: [
      { id: 'meditar', nombre: 'Respirar 5 min', emoji: '🧘' },
      { id: 'gratitud', nombre: 'Anotar gratitud', emoji: '🙏' },
      { id: 'diario', nombre: 'Escribir el diario', emoji: '📔' },
      { id: 'desconectar', nombre: 'Desconexión digital', emoji: '📵' },
      { id: 'silencio', nombre: 'Un rato en silencio', emoji: '🤫' },
      { id: 'naturaleza', nombre: 'Salir al aire libre', emoji: '🌳' },
    ],
  },
  {
    id: 'productividad',
    nombre: 'Productividad',
    habitos: [
      { id: 'top3', nombre: 'Definir mis 3 de hoy', emoji: '🎯' },
      { id: 'cama', nombre: 'Hacer la cama', emoji: '🛏️' },
      { id: 'sinmovil', nombre: 'Sin móvil la 1ª hora', emoji: '🌅' },
      { id: 'planificar', nombre: 'Planificar mañana', emoji: '🗓️' },
      { id: 'foco', nombre: 'Una hora de foco', emoji: '⏳' },
      { id: 'inbox', nombre: 'Vaciar la bandeja', emoji: '📥' },
    ],
  },
  {
    id: 'aprendizaje',
    nombre: 'Aprendizaje',
    habitos: [
      { id: 'leer', nombre: 'Leer 10 páginas', emoji: '📖' },
      { id: 'idioma', nombre: 'Idioma 10 min', emoji: '🗣️' },
      { id: 'escribir', nombre: 'Escribir un rato', emoji: '✍️' },
      { id: 'curso', nombre: 'Avanzar un curso', emoji: '🎓' },
      { id: 'instrumento', nombre: 'Practicar música', emoji: '🎸' },
      { id: 'nuevo', nombre: 'Aprender algo nuevo', emoji: '💡' },
    ],
  },
  {
    id: 'relaciones',
    nombre: 'Relaciones',
    habitos: [
      { id: 'llamar', nombre: 'Llamar a alguien', emoji: '📞' },
      { id: 'aprecio', nombre: 'Mensaje de aprecio', emoji: '💌' },
      { id: 'familia', nombre: 'Tiempo en familia', emoji: '👨‍👩‍👧' },
      { id: 'comer', nombre: 'Comer acompañado', emoji: '🍽️' },
      { id: 'amabilidad', nombre: 'Un acto de amabilidad', emoji: '🤝' },
      { id: 'amigo', nombre: 'Conectar con un amigo', emoji: '🫂' },
    ],
  },
  {
    id: 'finanzas',
    nombre: 'Finanzas',
    habitos: [
      { id: 'gastos', nombre: 'Registrar gastos', emoji: '🧾' },
      { id: 'ahorro', nombre: 'Apartar un ahorro', emoji: '🐖' },
      { id: 'sincompras', nombre: 'Sin compras impulsivas', emoji: '🚫' },
      { id: 'presupuesto', nombre: 'Revisar el presupuesto', emoji: '📊' },
      { id: 'cocinar', nombre: 'Cocinar en casa', emoji: '🍳' },
      { id: 'cafe', nombre: 'Café en casa', emoji: '☕' },
    ],
  },
]

// Lista plana de todos los hábitos, en orden de catálogo.
export const TODOS_HABITOS = CATEGORIAS.flatMap((c) =>
  c.habitos.map((h) => ({ ...h, categoria: c.id })),
)

// Acceso rápido por id.
export const HABITOS_POR_ID = Object.fromEntries(
  TODOS_HABITOS.map((h) => [h.id, h]),
)

// Índice de orden, para mantener los hábitos ordenados como en el catálogo.
const ORDEN = Object.fromEntries(TODOS_HABITOS.map((h, i) => [h.id, i]))
export const ordenHabito = (id) => ORDEN[id] ?? 999

// Selección sugerida la primera vez (el usuario puede cambiarla).
export const SELECCION_SUGERIDA = ['agua', 'mover', 'leer', 'meditar']

// Recomendación de la metodología: pocos hábitos a la vez.
export const HABITOS_RECOMENDADOS = 4
export const HABITOS_MAXIMO = 6

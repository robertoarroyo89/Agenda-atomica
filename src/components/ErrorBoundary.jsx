import { Component } from 'react'

// Captura cualquier error de renderizado y muestra un aviso legible
// en lugar de dejar la pantalla en blanco.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="w-full max-w-sm rounded-[28px] border border-white/40 bg-white/80 p-6 text-center shadow-card backdrop-blur-2xl">
            <p className="text-[40px]">⚠️</p>
            <h1 className="mt-2 text-[20px] font-bold tracking-tight text-zinc-900">
              Algo ha fallado
            </h1>
            <p className="mt-2 text-[15px] leading-relaxed text-zinc-500">
              Recarga la página. Si vuelve a pasar, revisa la consola del
              navegador (F12) para ver el detalle.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-5 w-full rounded-2xl bg-zinc-900 py-3 text-[16px] font-semibold text-white transition-all duration-300 ease-ios active:scale-95"
            >
              Recargar
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

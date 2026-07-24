import { useAuth } from '../contexts/AuthContext'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { state, actions } = useAuth()
  const location = useLocation()

  const handleSignOut = async () => {
    await actions.signOut()
  }

  const isActive = (path: string) => {
    return location.pathname === path
      ? 'text-violet-400 bg-violet-500/10'
      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-white/[0.06] bg-surface-0/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center shadow-glow-violet group-hover:scale-110 transition-transform duration-300">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <span className="font-display tracking-wider text-base font-bold text-white group-hover:text-violet-400 transition-colors duration-300">
              LEXZ
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {state.user ? (
              <>
                <div className="hidden md:flex items-center gap-1">
                  <Link to="/dashboard" className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/dashboard')}`}>
                    <svg className="w-4 h-4 inline mr-1.5 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Inicio
                  </Link>
                  <Link to="/clients" className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/clients')}`}>
                    <svg className="w-4 h-4 inline mr-1.5 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Clientes
                  </Link>
                  <Link to="/expedients" className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/expedients')}`}>
                    <svg className="w-4 h-4 inline mr-1.5 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Expedientes
                  </Link>
                  <Link to="/events" className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/events')}`}>
                    <svg className="w-4 h-4 inline mr-1.5 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Agenda
                  </Link>
                  <Link to="/templates" className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/templates')}`}>
                    <svg className="w-4 h-4 inline mr-1.5 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Plantillas
                  </Link>
                </div>

                <div className="flex items-center gap-3 ml-2 md:ml-4 pl-4 border-l border-white/[0.06]">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                    {state.user.email?.[0]}
                  </div>
                  <span className="text-xs text-slate-500 hidden lg:inline-block max-w-[140px] truncate">
                    {state.user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="bg-white/[0.06] hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/[0.06] hover:border-rose-500/20 transition-all duration-200"
                  >
                    Salir
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="btn-primary"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalExpedients: 0,
    totalEvents: 0,
  })
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    const [clients, expedients, events] = await Promise.all([
      supabase.from('clients').select('count', { count: 'exact' }),
      supabase.from('expedients').select('count', { count: 'exact' }),
      supabase.from('events').select('count', { count: 'exact' }),
    ])

    setStats({
      totalClients: clients.data?.[0]?.count || 0,
      totalExpedients: expedients.data?.[0]?.count || 0,
      totalEvents: events.data?.[0]?.count || 0,
    })

    setLoading(false)
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="py-6 animate-fadeIn">
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold text-white tracking-tight">
          Panel de Control
        </h1>
        <p className="text-sm text-slate-500 mt-1.5">
          Resumen operativo del estudio jurídico y seguimiento de expedientes.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/clients" className="card group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Clientes</p>
              <h3 className="text-4xl font-display font-bold text-white group-hover:text-violet-400 transition-colors duration-200">
                {stats.totalClients}
              </h3>
              <p className="text-xs text-violet-400 font-medium">Gestionar cartera →</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
          </div>
        </Link>

        <Link to="/expedients" className="card group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Expedientes Activos</p>
              <h3 className="text-4xl font-display font-bold text-white group-hover:text-cyan-400 transition-colors duration-200">
                {stats.totalExpedients}
              </h3>
              <p className="text-xs text-cyan-400 font-medium">Ver causas judiciales →</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
          </div>
        </Link>

        <Link to="/events" className="card group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Eventos en Agenda</p>
              <h3 className="text-4xl font-display font-bold text-white group-hover:text-emerald-400 transition-colors duration-200">
                {stats.totalEvents}
              </h3>
              <p className="text-xs text-emerald-400 font-medium">Revisar audiencias →</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Welcome Panel */}
      <div className="card bg-gradient-to-br from-surface-2 via-surface-2 to-violet-500/5 border-violet-500/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute left-0 bottom-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-400 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider border border-violet-500/20">
            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse-glow" />
            LexSearch Premium
          </span>
          <h2 className="text-2xl font-display font-bold text-white pt-1">
            Bienvenido al Portal Ejecutivo
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Tu entorno digital de gestión jurídica está conectado. Aquí puedes dar seguimiento a las causas en curso, agendar audiencias judiciales, redactar escritos utilizando plantillas predefinidas y mantener actualizada tu cartera de clientes en tiempo real.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/expedients" className="btn-primary">
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              Ver Expedientes
            </Link>
            <Link to="/events" className="btn-secondary">
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              Ver Agenda Semanal
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

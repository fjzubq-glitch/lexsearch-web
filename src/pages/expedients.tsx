import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function ExpedientsPage() {
  const { state } = useAuth()
  const [expedients, setExpedients] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [caratula, setCaratula] = useState('')
  const [number, setNumber] = useState('')
  const [court, setCourt] = useState('')
  const [status, setStatus] = useState('Abierto')
  const [forum, setForum] = useState('')
  const [clientId, setClientId] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    const expedientsRes = await supabase
      .from('expedients')
      .select('*, clients(id, name, company_name, type)')
      .order('created_at', { ascending: false })

    const clientsRes = await supabase
      .from('clients')
      .select('id, name, company_name, type')
      .order('name', { ascending: true })

    if (expedientsRes.error) {
      setError(expedientsRes.error.message)
    } else {
      setExpedients(expedientsRes.data || [])
    }

    if (!clientsRes.error) {
      setClients(clientsRes.data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const deleteExpedient = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este expediente?')) return

    const { error } = await supabase.from('expedients').delete().eq('id', id)

    if (error) {
      setError(error.message)
    } else {
      setExpedients(prev => prev.filter(e => e.id !== id))
    }
  }

  const handleCreateExpedient = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitLoading(true)

    if (!clientId) {
      setError('Por favor selecciona un cliente.')
      setSubmitLoading(false)
      return
    }

    const expedientData = {
      caratula,
      number,
      court,
      status,
      forum,
      client_id: clientId,
      lawyer_id: state.user?.id || null
    }

    const { data, error: insertError } = await supabase
      .from('expedients')
      .insert([expedientData])
      .select('*, clients(id, name, company_name, type)')

    if (insertError) {
      setError(insertError.message)
    } else {
      if (data && data[0]) {
        setExpedients(prev => [data[0], ...prev])
      }
      setCaratula('')
      setNumber('')
      setCourt('')
      setStatus('Abierto')
      setForum('')
      setClientId('')
      setIsModalOpen(false)
    }
    setSubmitLoading(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="py-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Gestión de Expedientes</h1>
          <p className="text-sm text-slate-500 mt-0.5">{expedients.length} expedientes registrados</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nuevo Expediente
          </button>
          <button onClick={fetchData} className="btn-secondary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm p-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {expedients.length === 0 ? (
          <div className="card col-span-full text-center py-12">
            <svg className="w-10 h-10 text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p className="text-slate-500 text-sm">No hay expedientes registrados.</p>
          </div>
        ) : (
          expedients.map((expedient: any) => (
            <div key={expedient.id} className="card group">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-violet-500/10 text-violet-400 text-xs px-2.5 py-0.5 rounded-full font-medium border border-violet-500/20">
                      {expedient.forum}
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${expedient.status === 'Abierto'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-white/[0.06] text-slate-400 border border-white/[0.06]'
                    }`}>
                      {expedient.status}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white">{expedient.caratula}</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-slate-400">
                      <span className="text-slate-500 font-medium">N°:</span> {expedient.number}
                    </p>
                    <p className="text-sm text-slate-400">
                      <span className="text-slate-500 font-medium">Juzgado:</span> {expedient.court}
                    </p>
                    <p className="text-sm text-slate-400">
                      <span className="text-slate-500 font-medium">Cliente:</span>{' '}
                      {expedient.clients ? (
                        expedient.clients.type === 'physical' ? expedient.clients.name : expedient.clients.company_name
                      ) : (
                        <span className="text-rose-400 italic">No asignado</span>
                      )}
                    </p>
                  </div>
                </div>
                <button onClick={() => deleteExpedient(expedient.id)} className="btn-danger">
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="card w-full max-w-lg p-0 overflow-hidden">
            <div className="bg-gradient-to-r from-violet-500/10 to-cyan-500/10 px-6 py-4 flex justify-between items-center border-b border-white/[0.06]">
              <h2 className="text-lg font-display font-bold text-white">Nuevo Expediente</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateExpedient} className="p-6 space-y-4">
              <div>
                <label className="form-label">Cliente Asociado *</label>
                <select required value={clientId} onChange={(e) => setClientId(e.target.value)}>
                  <option value="">-- Seleccionar Cliente --</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.type === 'physical' ? c.name : c.company_name} ({c.type === 'physical' ? 'DNI: ' : 'CUIT: '}{c.cuit_dni})
                    </option>
                  ))}
                </select>
                {clients.length === 0 && (
                  <p className="text-xs text-rose-400 mt-1">Debes registrar al menos un cliente antes de crear un expediente.</p>
                )}
              </div>

              <div>
                <label className="form-label">Carátula *</label>
                <input type="text" required value={caratula} onChange={(e) => setCaratula(e.target.value)} placeholder="Ej: Pérez Juan c/ Empresa S.A. s/ Despido" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Número de Expediente *</label>
                  <input type="text" required value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Ej: 12345/2026" />
                </div>
                <div>
                  <label className="form-label">Fuero / Materia *</label>
                  <input type="text" required value={forum} onChange={(e) => setForum(e.target.value)} placeholder="Ej: Laboral, Civil, Comercial" />
                </div>
              </div>

              <div>
                <label className="form-label">Juzgado / Tribunal *</label>
                <input type="text" required value={court} onChange={(e) => setCourt(e.target.value)} placeholder="Ej: Juzgado de Trabajo N° 4" />
              </div>

              <div>
                <label className="form-label">Estado *</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Abierto">Abierto</option>
                  <option value="En Trámite">En Trámite</option>
                  <option value="Sentencia">Sentencia</option>
                  <option value="Apelado">Apelado</option>
                  <option value="Cerrado">Cerrado</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" disabled={submitLoading || !clientId} className="btn-primary">
                  {submitLoading ? 'Guardando...' : 'Guardar Expediente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

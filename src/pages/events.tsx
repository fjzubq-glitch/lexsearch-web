import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function EventsPage() {
  const { state } = useAuth()
  const [events, setEvents] = useState<any[]>([])
  const [expedients, setExpedients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [startDatetime, setStartDatetime] = useState('')
  const [description, setDescription] = useState('')
  const [expedientId, setExpedientId] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    const eventsRes = await supabase
      .from('events')
      .select('*, expedients(id, caratula, number)')
      .order('start_datetime', { ascending: true })

    const expedientsRes = await supabase
      .from('expedients')
      .select('id, caratula, number')
      .order('caratula', { ascending: true })

    if (eventsRes.error) {
      setError(eventsRes.error.message)
    } else {
      setEvents(eventsRes.data || [])
    }

    if (!expedientsRes.error) {
      setExpedients(expedientsRes.data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const deleteEvent = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este evento?')) return

    const { error } = await supabase.from('events').delete().eq('id', id)

    if (error) {
      setError(error.message)
    } else {
      setEvents(prev => prev.filter(e => e.id !== id))
    }
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitLoading(true)

    const eventData = {
      title,
      start_datetime: startDatetime,
      description,
      expedient_id: expedientId || null,
      lawyer_id: state.user?.id || null
    }

    const { data, error: insertError } = await supabase
      .from('events')
      .insert([eventData])
      .select('*, expedients(id, caratula, number)')

    if (insertError) {
      setError(insertError.message)
    } else {
      if (data && data[0]) {
        setEvents(prev => {
          const updated = [...prev, data[0]]
          return updated.sort((a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime())
        })
      }
      setTitle('')
      setStartDatetime('')
      setDescription('')
      setExpedientId('')
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
          <h1 className="text-2xl font-display font-bold text-white">Agenda y Eventos</h1>
          <p className="text-sm text-slate-500 mt-0.5">{events.length} eventos agendados</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nuevo Evento
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

      <div className="grid gap-4">
        {events.length === 0 ? (
          <div className="card text-center py-12">
            <svg className="w-10 h-10 text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <p className="text-slate-500 text-sm">No hay eventos agendados.</p>
          </div>
        ) : (
          events.map((event: any) => {
            const eventDate = new Date(event.start_datetime)
            const isPast = eventDate.getTime() < Date.now()

            return (
              <div
                key={event.id}
                className={`card group relative overflow-hidden ${isPast ? 'opacity-60' : ''}`}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${isPast ? 'bg-slate-600' : 'bg-gradient-to-b from-violet-500 to-cyan-400'}`} />
                <div className="pl-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-violet-400 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                          </svg>
                          {eventDate.toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        <span className="text-sm text-slate-500 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {eventDate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-white">{event.title}</h3>
                      {event.description && (
                        <p className="text-sm text-slate-400 bg-white/[0.03] p-2.5 rounded-lg border border-white/[0.04] max-w-xl">
                          {event.description}
                        </p>
                      )}
                      {event.expedients && (
                        <div className="text-xs text-slate-500 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                          <span>Expediente:</span>
                          <a href="/expedients" className="font-semibold text-violet-400 hover:text-violet-300 transition-colors">
                            {event.expedients.caratula} ({event.expedients.number})
                          </a>
                        </div>
                      )}
                    </div>
                    <button onClick={() => deleteEvent(event.id)} className="btn-danger">
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="card w-full max-w-lg p-0 overflow-hidden">
            <div className="bg-gradient-to-r from-violet-500/10 to-cyan-500/10 px-6 py-4 flex justify-between items-center border-b border-white/[0.06]">
              <h2 className="text-lg font-display font-bold text-white">Nuevo Evento / Audiencia</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
              <div>
                <label className="form-label">Título del Evento *</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Audiencia Preliminar, Vencimiento de Plazo..." />
              </div>

              <div>
                <label className="form-label">Fecha y Hora de Inicio *</label>
                <input type="datetime-local" required value={startDatetime} onChange={(e) => setStartDatetime(e.target.value)} />
              </div>

              <div>
                <label className="form-label">Expediente Relacionado (Opcional)</label>
                <select value={expedientId} onChange={(e) => setExpedientId(e.target.value)}>
                  <option value="">-- No asociar a ningún expediente --</option>
                  {expedients.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.caratula} (N°: {ex.number})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Descripción</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalles sobre el evento, dirección, modalidad presencial/virtual..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" disabled={submitLoading} className="btn-primary">
                  {submitLoading ? 'Guardando...' : 'Agendar Evento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

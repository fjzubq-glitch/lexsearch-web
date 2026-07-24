import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function TemplatesPage() {
  const { state } = useAuth()
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null)
  const [name, setName] = useState('')
  const [type, setType] = useState('Carta Documento')
  const [content, setContent] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)

  const fetchTemplates = async () => {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setTemplates(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  const deleteTemplate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('¿Estás seguro de eliminar esta plantilla?')) return

    const { error } = await supabase.from('templates').delete().eq('id', id)

    if (error) {
      setError(error.message)
    } else {
      setTemplates(prev => prev.filter(t => t.id !== id))
    }
  }

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitLoading(true)

    const templateData = {
      name,
      type,
      content,
      lawyer_id: state.user?.id || null
    }

    const { data, error: insertError } = await supabase
      .from('templates')
      .insert([templateData])
      .select()

    if (insertError) {
      setError(insertError.message)
    } else {
      if (data && data[0]) {
        setTemplates(prev => [data[0], ...prev])
      }
      setName('')
      setType('Carta Documento')
      setContent('')
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
          <h1 className="text-2xl font-display font-bold text-white">Gestión de Plantillas</h1>
          <p className="text-sm text-slate-500 mt-0.5">{templates.length} plantillas disponibles</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nueva Plantilla
          </button>
          <button onClick={fetchTemplates} className="btn-secondary">
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.length === 0 ? (
          <div className="card col-span-full text-center py-12">
            <svg className="w-10 h-10 text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p className="text-slate-500 text-sm">No hay plantillas registradas.</p>
          </div>
        ) : (
          templates.map((template: any) => (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className="card group cursor-pointer"
            >
              <div className="space-y-3">
                <span className="inline-flex items-center bg-violet-500/10 text-violet-400 text-xs px-2.5 py-0.5 rounded-full font-medium border border-violet-500/20">
                  {template.type}
                </span>
                <h3 className="text-base font-semibold text-white group-hover:text-violet-400 transition-colors">{template.name}</h3>
                <p className="text-sm text-slate-400 line-clamp-3 bg-white/[0.02] p-3 rounded-lg border border-white/[0.04] font-mono leading-relaxed">
                  {template.content}
                </p>
              </div>
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/[0.06]">
                <span className="text-xs text-violet-400 font-medium group-hover:text-violet-300 transition-colors">Ver completo →</span>
                <button
                  onClick={(e) => deleteTemplate(template.id, e)}
                  className="btn-danger"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal - Nueva Plantilla */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="card w-full max-w-2xl p-0 overflow-hidden">
            <div className="bg-gradient-to-r from-violet-500/10 to-cyan-500/10 px-6 py-4 flex justify-between items-center border-b border-white/[0.06]">
              <h2 className="text-lg font-display font-bold text-white">Nueva Plantilla Jurídica</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateTemplate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Nombre de la Plantilla *</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Demanda por despido incausado" />
                </div>
                <div>
                  <label className="form-label">Tipo de Documento *</label>
                  <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="Carta Documento">Carta Documento</option>
                    <option value="Demanda">Demanda</option>
                    <option value="Contestación">Contestación de Demanda</option>
                    <option value="Oficio / Cédula">Oficio / Cédula</option>
                    <option value="Contrato">Contrato / Convenio</option>
                    <option value="Otro Escrito">Otro Escrito Jurídico</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Contenido de la Plantilla *</label>
                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escribe el cuerpo del documento aquí. Puedes usar corchetes para variables, ej: [Nombre del Cliente]..."
                  rows={10}
                  className="!font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" disabled={submitLoading} className="btn-primary">
                  {submitLoading ? 'Guardando...' : 'Guardar Plantilla'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Vista Detalle */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="card w-full max-w-3xl p-0 overflow-hidden flex flex-col h-[85vh]">
            <div className="bg-gradient-to-r from-violet-500/10 to-cyan-500/10 px-6 py-4 flex justify-between items-center border-b border-white/[0.06] shrink-0">
              <div>
                <span className="inline-flex items-center bg-violet-500/10 text-violet-400 text-xs px-2.5 py-0.5 rounded-full font-medium border border-violet-500/20 mb-1.5">
                  {selectedTemplate.type}
                </span>
                <h2 className="text-lg font-display font-bold text-white">{selectedTemplate.name}</h2>
              </div>
              <button onClick={() => setSelectedTemplate(null)} className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-8 bg-surface-1 flex-1 overflow-y-auto flex justify-center">
              <div className="bg-surface-3 w-full max-w-2xl min-h-[800px] shadow-lg border border-white/[0.06] p-12 font-mono text-slate-300 whitespace-pre-wrap leading-relaxed text-sm rounded-xl">
                {selectedTemplate.content}
              </div>
            </div>

            <div className="bg-surface-2 px-6 py-4 flex justify-end gap-3 border-t border-white/[0.06] shrink-0">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedTemplate.content)
                  alert('¡Plantilla copiada al portapapeles!')
                }}
                className="btn-primary"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                </svg>
                Copiar Texto
              </button>
              <button onClick={() => setSelectedTemplate(null)} className="btn-secondary">
                Cerrar Vista
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function ClientsPage() {
  const { state } = useAuth()
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [type, setType] = useState<'physical' | 'legal'>('physical')
  const [name, setName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [cuitDni, setCuitDni] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [addressReal, setAddressReal] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)

  const fetchClients = async () => {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setClients(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este cliente?')) return

    const { error } = await supabase.from('clients').delete().eq('id', id)

    if (error) {
      setError(error.message)
    } else {
      setClients(prev => prev.filter(c => c.id !== id))
    }
  }

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitLoading(true)

    const clientData = {
      type,
      name: type === 'physical' ? name : null,
      company_name: type === 'legal' ? companyName : null,
      cuit_dni: cuitDni,
      email,
      phone,
      address_real: addressReal,
      lawyer_id: state.user?.id || null
    }

    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select()

    if (error) {
      setError(error.message)
    } else {
      if (data && data[0]) {
        setClients(prev => [data[0], ...prev])
      }
      setName('')
      setCompanyName('')
      setCuitDni('')
      setEmail('')
      setPhone('')
      setAddressReal('')
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
          <h1 className="text-2xl font-display font-bold text-white">Gestión de Clientes</h1>
          <p className="text-sm text-slate-500 mt-0.5">{clients.length} clientes registrados</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nuevo Cliente
          </button>
          <button onClick={fetchClients} className="btn-secondary">
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
        {clients.length === 0 ? (
          <div className="card col-span-full text-center py-12">
            <svg className="w-10 h-10 text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            <p className="text-slate-500 text-sm">No hay clientes registrados.</p>
          </div>
        ) : (
          clients.map((client: any) => (
            <div key={client.id} className="card group">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <span className={`inline-flex items-center text-xs px-2.5 py-0.5 rounded-full font-medium ${client.type === 'physical'
                    ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                    : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  }`}>
                    {client.type === 'physical' ? 'Particular' : 'Empresa'}
                  </span>
                  <h3 className="text-base font-semibold text-white">
                    {client.type === 'physical' ? client.name : client.company_name}
                  </h3>
                  <div className="space-y-1">
                    <p className="text-sm text-slate-400">
                      <span className="text-slate-500 font-medium">{client.type === 'physical' ? 'DNI' : 'CUIT'}:</span> {client.cuit_dni}
                    </p>
                    {client.email && (
                      <p className="text-sm text-slate-400">
                        <span className="text-slate-500 font-medium">Email:</span> {client.email}
                      </p>
                    )}
                    {client.phone && (
                      <p className="text-sm text-slate-400">
                        <span className="text-slate-500 font-medium">Tel:</span> {client.phone}
                      </p>
                    )}
                    {client.address_real && (
                      <p className="text-sm text-slate-400">
                        <span className="text-slate-500 font-medium">Dir:</span> {client.address_real}
                      </p>
                    )}
                  </div>
                </div>
                <button onClick={() => handleDelete(client.id)} className="btn-danger">
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
              <h2 className="text-lg font-display font-bold text-white">Nuevo Cliente</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="p-6 space-y-4">
              <div>
                <label className="form-label">Tipo de Cliente</label>
                <div className="flex gap-4 mt-2">
                  <button type="button" onClick={() => setType('physical')} className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${type === 'physical'
                    ? 'bg-violet-500/10 border-violet-500/30 text-violet-400'
                    : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:border-white/[0.1]'
                  }`}>
                    Particular
                  </button>
                  <button type="button" onClick={() => setType('legal')} className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${type === 'legal'
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                    : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:border-white/[0.1]'
                  }`}>
                    Empresa
                  </button>
                </div>
              </div>

              {type === 'physical' ? (
                <div>
                  <label className="form-label">Nombre Completo *</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Juan Pérez" />
                </div>
              ) : (
                <div>
                  <label className="form-label">Razón Social *</label>
                  <input type="text" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Ej: LexSearch S.A." />
                </div>
              )}

              <div>
                <label className="form-label">{type === 'physical' ? 'DNI *' : 'CUIT *'}</label>
                <input type="text" required value={cuitDni} onChange={(e) => setCuitDni(e.target.value)} placeholder={type === 'physical' ? 'Ej: 35123456' : 'Ej: 30-12345678-9'} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="juan@example.com" />
                </div>
                <div>
                  <label className="form-label">Teléfono</label>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+54 9 11 1234-5678" />
                </div>
              </div>

              <div>
                <label className="form-label">Dirección Real</label>
                <input type="text" value={addressReal} onChange={(e) => setAddressReal(e.target.value)} placeholder="Av. Corrientes 1234, CABA" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" disabled={submitLoading} className="btn-primary">
                  {submitLoading ? 'Guardando...' : 'Guardar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

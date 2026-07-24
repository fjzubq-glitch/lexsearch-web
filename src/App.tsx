import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/login'
import Signup from './pages/signup'
import Dashboard from './pages/dashboard'
import Clients from './pages/clients'
import Expedients from './pages/expedients'
import Events from './pages/events'
import Templates from './pages/templates'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { state } = useAuth()
  if (state.loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
    </div>
  )
  if (!state.user) return <Navigate to="/login" />
  return children
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { state } = useAuth()
  if (state.loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
    </div>
  )
  if (state.user) return <Navigate to="/dashboard" />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="noise-bg min-h-screen bg-surface-0 relative">
          <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.12),transparent)] pointer-events-none" />
          <AppContent />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

function AppContent() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-6 min-h-[calc(100vh-64px)] relative z-10">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/clients" element={<PrivateRoute><Clients /></PrivateRoute>} />
          <Route path="/expedients" element={<PrivateRoute><Expedients /></PrivateRoute>} />
          <Route path="/events" element={<PrivateRoute><Events /></PrivateRoute>} />
          <Route path="/templates" element={<PrivateRoute><Templates /></PrivateRoute>} />
        </Routes>
      </div>
    </>
  )
}

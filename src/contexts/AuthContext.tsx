import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '../lib/supabase'

type Role = 'admin' | 'abogado' | 'secretaria'

interface User {
  id: string
  email: string
  role: Role
}

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, role: Role) => Promise<void>
  signOut: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<{ state: AuthState; actions: AuthActions } | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const role = (session.user.user_metadata?.role as Role) || 'secretaria'
        setState({
          user: {
            id: session.user.id,
            email: session.user.email || '',
            role,
          },
          loading: false,
          error: null,
        })
      } else {
        setState({
          user: null,
          loading: false,
          error: null,
        })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      const role = (session.user.user_metadata?.role as Role) || 'secretaria'
      setState({
        user: {
          id: session.user.id,
          email: session.user.email || '',
          role,
        },
        loading: false,
        error: null,
      })
    } else {
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setState(prev => ({ ...prev, error: error.message, loading: false }))
        return
      }
      if (data.session && data.user) {
        const role = (data.user.user_metadata?.role as Role) || 'secretaria'
        setState({
          user: {
            id: data.user.id,
            email: data.user.email || '',
            role,
          },
          loading: false,
          error: null,
        })
      }
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Error de autenticación', loading: false }))
    }
  }

  const signUp = async (email: string, password: string, role: Role) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role },
        },
      })
      if (error) {
        setState(prev => ({ ...prev, error: error.message, loading: false }))
        return
      }
      setState(prev => ({ ...prev, error: 'Registro exitoso. Verifique su email.', loading: false }))
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Error al registrarse', loading: false }))
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setState({
      user: null,
      loading: false,
      error: null,
    })
  }

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }))
  }

  const actions: AuthActions = { signIn, signUp, signOut, clearError }

  return (
    <AuthContext.Provider value={{ state, actions }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

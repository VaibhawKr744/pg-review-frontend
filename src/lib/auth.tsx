import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { User } from '../types'
import * as apiClient from './api'

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(() => Boolean(apiClient.getToken()))

  // On load, validate any stored token by fetching /auth/me
  useEffect(() => {
    if (!apiClient.getToken()) return
    apiClient
      .getMe()
      .then(setUser)
      .catch(() => apiClient.clearToken())
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const token = await apiClient.login(email, password)
    apiClient.setToken(token)
    setUser(await apiClient.getMe())
  }, [])

  const signup = useCallback(
    async (email: string, password: string) => {
      await apiClient.signup(email, password)
      await login(email, password)
    },
    [login],
  )

  const logout = useCallback(() => {
    apiClient.clearToken()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, signup, logout }),
    [user, loading, login, signup, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

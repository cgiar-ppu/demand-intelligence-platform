import { useState, useCallback } from 'react'

interface AuthUser {
  id: string
  email: string
  name: string
  role: string
}

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
}

/**
 * Authentication hook placeholder.
 * Will integrate with AWS Cognito in production.
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  })

  const login = useCallback(async (_email: string, _password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }))
    // TODO: Integrate with Cognito
    setState((prev) => ({ ...prev, isLoading: false }))
  }, [])

  const logout = useCallback(async () => {
    setState({ user: null, isAuthenticated: false, isLoading: false })
  }, [])

  return { ...state, login, logout }
}

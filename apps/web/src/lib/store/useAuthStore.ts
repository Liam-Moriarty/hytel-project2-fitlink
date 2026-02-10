import { create } from 'zustand'
import { User } from 'firebase/auth'
import { UserData } from '@/lib/api/user'

interface AuthState {
  user: User | null
  userData: UserData | null
  loading: boolean
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setUserData: (userData: UserData | null) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  userData: null,
  loading: true,
  isAuthenticated: false,
  setUser: user => set({ user, isAuthenticated: !!user, loading: false }),
  setUserData: userData => set({ userData }),
  setLoading: loading => set({ loading }),
}))

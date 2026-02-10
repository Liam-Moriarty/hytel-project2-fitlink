import { create } from 'zustand'
import { persist } from 'zustand/middleware'
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
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      userData: null,
      loading: true,
      isAuthenticated: false,
      setUser: user => set({ user, isAuthenticated: !!user, loading: false }),
      setUserData: userData => {
        // Persist essential user data to localStorage
        set({ userData })
      },
      setLoading: loading => set({ loading }),
      clearAuth: () => set({ user: null, userData: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state: AuthState) => ({
        // Only persist essential user data, not the Firebase User object
        userData: state.userData
          ? {
              uid: state.userData.uid,
              email: state.userData.email,
              displayName: state.userData.displayName,
              role: state.userData.role,
            }
          : null,
      }),
    }
  )
)

import { useMutation } from '@tanstack/react-query'
import { signUpWithEmail, signInWithEmail, signInWithGoogle, logout } from '@/lib/api/auth'
import { getFullUser } from '@/lib/api/user'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { LoginFormValues, SignupFormValues } from '@/lib/schemas/auth'
import { useNavigate } from 'react-router-dom'

export const useSignupMutation = () => {
  const navigate = useNavigate()
  const setUser = useAuthStore(state => state.setUser)
  const setUserData = useAuthStore(state => state.setUserData)

  return useMutation({
    mutationFn: (data: SignupFormValues) => signUpWithEmail(data),
    onSuccess: async user => {
      const userDoc = await getFullUser(user.uid)
      setUser(user)
      setUserData(userDoc)
      if (userDoc?.role) {
        navigate('/dashboard')
      } else {
        navigate('/onboarding')
      }
    },
  })
}

export const useLoginMutation = () => {
  const navigate = useNavigate()
  const setUser = useAuthStore(state => state.setUser)
  const setUserData = useAuthStore(state => state.setUserData)

  return useMutation({
    mutationFn: (data: LoginFormValues) => signInWithEmail(data),
    onSuccess: async user => {
      const userDoc = await getFullUser(user.uid)
      setUser(user)
      setUserData(userDoc)
      if (userDoc?.role) {
        navigate('/dashboard')
      } else {
        navigate('/onboarding')
      }
    },
  })
}

export const useGoogleLoginMutation = () => {
  const navigate = useNavigate()
  const setUser = useAuthStore(state => state.setUser)
  const setUserData = useAuthStore(state => state.setUserData)

  return useMutation({
    mutationFn: signInWithGoogle,
    onSuccess: async user => {
      const userDoc = await getFullUser(user.uid)
      setUser(user)
      setUserData(userDoc)
      if (userDoc?.role) {
        navigate('/dashboard')
      } else {
        navigate('/onboarding')
      }
    },
  })
}

export const useLogoutMutation = () => {
  const navigate = useNavigate()
  const clearAuth = useAuthStore(state => state.clearAuth)

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuth()
      navigate('/login')
    },
  })
}

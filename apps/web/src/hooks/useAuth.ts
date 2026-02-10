import { useMutation } from '@tanstack/react-query'
import { signUpWithEmail, signInWithEmail, signInWithGoogle, logout } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useNavigate } from 'react-router-dom'
import { LoginFormValues, SignupFormValues } from '@/lib/schemas/auth'

export const useSignupMutation = () => {
  const navigate = useNavigate()
  const setUser = useAuthStore(state => state.setUser)

  return useMutation({
    mutationFn: (data: SignupFormValues) => signUpWithEmail(data),
    onSuccess: user => {
      setUser(user)
      navigate('/onboarding')
    },
  })
}

export const useLoginMutation = () => {
  const navigate = useNavigate()
  const setUser = useAuthStore(state => state.setUser)

  return useMutation({
    mutationFn: (data: LoginFormValues) => signInWithEmail(data),
    onSuccess: user => {
      setUser(user)
      navigate('/onboarding')
    },
  })
}

export const useGoogleLoginMutation = () => {
  const navigate = useNavigate()
  const setUser = useAuthStore(state => state.setUser)

  return useMutation({
    mutationFn: signInWithGoogle,
    onSuccess: user => {
      setUser(user)
      navigate('/onboarding')
    },
  })
}

export const useLogoutMutation = () => {
  const navigate = useNavigate()
  const setUser = useAuthStore(state => state.setUser)

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setUser(null)
      navigate('/login')
    },
  })
}

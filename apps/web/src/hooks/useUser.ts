/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAuth } from 'firebase/auth'
import { UserData } from '@/interface'
import {
  userKeys,
  getFullUser,
  updateUser,
  updateTraineeGoals,
  createTraineeGoals,
  createTrainerProfile,
} from '@/lib/api/user'

export function useCurrentUser() {
  const auth = getAuth()
  const currentUser = auth.currentUser

  return useQuery<UserData | null>({
    queryKey: userKeys.detail(currentUser?.uid ?? ''),
    queryFn: () => (currentUser ? getFullUser(currentUser.uid) : null),
    enabled: !!currentUser,
  })
}

export function useUserProfile(uid: string | undefined) {
  return useQuery<UserData | null>({
    queryKey: userKeys.detail(uid ?? ''),
    queryFn: () => getFullUser(uid!),
    enabled: !!uid,
  })
}

export function useUpdateUser(uid: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<UserData>) => updateUser(uid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(uid) })
    },
  })
}

export function useUpdateTraineeGoals(uid: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: any) => updateTraineeGoals(uid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(uid) })
    },
  })
}

interface UpdateProfileParams {
  userData: Partial<UserData>
  traineeGoals?: any
  role?: string
}

export function useUpdateProfile(uid: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userData, traineeGoals, role }: UpdateProfileParams) => {
      await updateUser(uid, userData)
      if (role === 'trainee' && traineeGoals) {
        await updateTraineeGoals(uid, traineeGoals)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(uid) })
    },
  })
}

interface OnboardingParams {
  role: 'trainee' | 'trainer'
  userData: Partial<UserData>
  traineeGoals?: any
  trainerProfile?: any
}

export function useOnboarding(uid: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ role, userData, traineeGoals, trainerProfile }: OnboardingParams) => {
      await updateUser(uid, userData)
      if (role === 'trainee' && traineeGoals) {
        await createTraineeGoals(uid, traineeGoals)
      } else if (role === 'trainer' && trainerProfile) {
        await createTrainerProfile(uid, trainerProfile)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(uid) })
    },
  })
}

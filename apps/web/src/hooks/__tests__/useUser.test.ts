import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'

// Mock Firebase auth
const mockGetAuth = vi.fn()

vi.mock('firebase/auth', () => ({
  getAuth: () => mockGetAuth(),
}))

// Mock API functions
const mockGetFullUser = vi.fn()
const mockUpdateUser = vi.fn()
const mockUpdateTraineeGoals = vi.fn()
const mockCreateTraineeGoals = vi.fn()
const mockCreateTrainerProfile = vi.fn()

vi.mock('@/lib/api/user', () => ({
  userKeys: {
    all: ['user'] as const,
    detail: (uid: string) => ['user', uid] as const,
  },
  getFullUser: (...args: unknown[]) => mockGetFullUser(...args),
  updateUser: (...args: unknown[]) => mockUpdateUser(...args),
  updateTraineeGoals: (...args: unknown[]) => mockUpdateTraineeGoals(...args),
  createTraineeGoals: (...args: unknown[]) => mockCreateTraineeGoals(...args),
  createTrainerProfile: (...args: unknown[]) => mockCreateTrainerProfile(...args),
}))

import {
  useCurrentUser,
  useUserProfile,
  useUpdateUser,
  useUpdateTraineeGoals,
  useUpdateProfile,
  useOnboarding,
} from '../useUser'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useCurrentUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not fetch when no current user', () => {
    mockGetAuth.mockReturnValue({ currentUser: null })

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(false)
    expect(mockGetFullUser).not.toHaveBeenCalled()
  })

  it('fetches user data when authenticated', async () => {
    const mockUserData = { uid: 'u1', email: 'test@test.com', displayName: 'Test' }
    mockGetAuth.mockReturnValue({ currentUser: { uid: 'u1' } })
    mockGetFullUser.mockResolvedValue(mockUserData)

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.data).toEqual(mockUserData)
    })

    expect(mockGetFullUser).toHaveBeenCalledWith('u1')
  })
})

describe('useUserProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not fetch when uid is undefined', () => {
    const { result } = renderHook(() => useUserProfile(undefined), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(false)
    expect(mockGetFullUser).not.toHaveBeenCalled()
  })

  it('fetches user profile when uid provided', async () => {
    const mockUserData = { uid: 'u2', email: 'user@test.com' }
    mockGetFullUser.mockResolvedValue(mockUserData)

    const { result } = renderHook(() => useUserProfile('u2'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.data).toEqual(mockUserData)
    })

    expect(mockGetFullUser).toHaveBeenCalledWith('u2')
  })
})

describe('useUpdateUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls updateUser with uid and data', async () => {
    mockUpdateUser.mockResolvedValue(undefined)

    const { result } = renderHook(() => useUpdateUser('u1'), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ displayName: 'New Name' })

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith('u1', { displayName: 'New Name' })
    })
  })
})

describe('useUpdateTraineeGoals', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls updateTraineeGoals with uid and data', async () => {
    mockUpdateTraineeGoals.mockResolvedValue(undefined)

    const { result } = renderHook(() => useUpdateTraineeGoals('u1'), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ completedWorkouts: ['1-1'] })

    await waitFor(() => {
      expect(mockUpdateTraineeGoals).toHaveBeenCalledWith('u1', {
        completedWorkouts: ['1-1'],
      })
    })
  })
})

describe('useUpdateProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('updates user and trainee goals for trainee role', async () => {
    mockUpdateUser.mockResolvedValue(undefined)
    mockUpdateTraineeGoals.mockResolvedValue(undefined)

    const { result } = renderHook(() => useUpdateProfile('u1'), {
      wrapper: createWrapper(),
    })

    result.current.mutate({
      userData: { displayName: 'Updated' },
      traineeGoals: { goals: ['gain muscle'] },
      role: 'trainee',
    })

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith('u1', { displayName: 'Updated' })
      expect(mockUpdateTraineeGoals).toHaveBeenCalledWith('u1', { goals: ['gain muscle'] })
    })
  })

  it('only updates user for non-trainee role', async () => {
    mockUpdateUser.mockResolvedValue(undefined)

    const { result } = renderHook(() => useUpdateProfile('u1'), {
      wrapper: createWrapper(),
    })

    result.current.mutate({
      userData: { displayName: 'Trainer' },
      role: 'trainer',
    })

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith('u1', { displayName: 'Trainer' })
    })

    expect(mockUpdateTraineeGoals).not.toHaveBeenCalled()
  })
})

describe('useOnboarding', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates trainee goals for trainee role', async () => {
    mockUpdateUser.mockResolvedValue(undefined)
    mockCreateTraineeGoals.mockResolvedValue(undefined)

    const { result } = renderHook(() => useOnboarding('u1'), {
      wrapper: createWrapper(),
    })

    result.current.mutate({
      role: 'trainee',
      userData: { role: 'trainee' },
      traineeGoals: { goals: ['lose weight'] },
    })

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith('u1', { role: 'trainee' })
      expect(mockCreateTraineeGoals).toHaveBeenCalledWith('u1', { goals: ['lose weight'] })
    })

    expect(mockCreateTrainerProfile).not.toHaveBeenCalled()
  })

  it('creates trainer profile for trainer role', async () => {
    mockUpdateUser.mockResolvedValue(undefined)
    mockCreateTrainerProfile.mockResolvedValue(undefined)

    const { result } = renderHook(() => useOnboarding('u1'), {
      wrapper: createWrapper(),
    })

    result.current.mutate({
      role: 'trainer',
      userData: { role: 'trainer' },
      trainerProfile: { specialties: ['HIIT'] },
    })

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith('u1', { role: 'trainer' })
      expect(mockCreateTrainerProfile).toHaveBeenCalledWith('u1', { specialties: ['HIIT'] })
    })

    expect(mockCreateTraineeGoals).not.toHaveBeenCalled()
  })
})

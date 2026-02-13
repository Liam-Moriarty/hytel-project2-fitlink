/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'

// Mock dependencies
const mockNavigate = vi.fn()
const mockSetUser = vi.fn()
const mockSetUserData = vi.fn()
const mockClearAuth = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('@/lib/store/useAuthStore', () => ({
  useAuthStore: (selector: (state: any) => any) => {
    const state = {
      setUser: mockSetUser,
      setUserData: mockSetUserData,
      clearAuth: mockClearAuth,
    }
    return selector(state)
  },
}))

const mockSignUpWithEmail = vi.fn()
const mockSignInWithEmail = vi.fn()
const mockSignInWithGoogle = vi.fn()
const mockLogout = vi.fn()

vi.mock('@/lib/api/auth', () => ({
  signUpWithEmail: (...args: unknown[]) => mockSignUpWithEmail(...args),
  signInWithEmail: (...args: unknown[]) => mockSignInWithEmail(...args),
  signInWithGoogle: (...args: unknown[]) => mockSignInWithGoogle(...args),
  logout: (...args: unknown[]) => mockLogout(...args),
}))

const mockGetFullUser = vi.fn()

vi.mock('@/lib/api/user', () => ({
  getFullUser: (...args: unknown[]) => mockGetFullUser(...args),
  userKeys: {
    all: ['user'] as const,
    detail: (uid: string) => ['user', uid] as const,
  },
}))

const mockSetQueryData = vi.fn()
const mockRemoveQueries = vi.fn()

vi.mock('@/lib/queryClient', () => ({
  queryClient: {
    setQueryData: (...args: unknown[]) => mockSetQueryData(...args),
    removeQueries: (...args: unknown[]) => mockRemoveQueries(...args),
  },
}))

import {
  useSignupMutation,
  useLoginMutation,
  useGoogleLoginMutation,
  useLogoutMutation,
} from '../useAuth'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useSignupMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls signUpWithEmail and navigates to onboarding when user has no role', async () => {
    const mockUser = { uid: 'new-user', email: 'test@test.com' }
    mockSignUpWithEmail.mockResolvedValue(mockUser)
    mockGetFullUser.mockResolvedValue({ uid: 'new-user', email: 'test@test.com' })

    const { result } = renderHook(() => useSignupMutation(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
    })

    await waitFor(() => {
      expect(mockSignUpWithEmail).toHaveBeenCalledWith({
        name: 'Test',
        email: 'test@test.com',
        password: '123456',
      })
    })

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith(mockUser)
      expect(mockNavigate).toHaveBeenCalledWith('/onboarding')
    })
  })

  it('navigates to role dashboard when user has role', async () => {
    const mockUser = { uid: 'existing-user' }
    mockSignUpWithEmail.mockResolvedValue(mockUser)
    mockGetFullUser.mockResolvedValue({
      uid: 'existing-user',
      role: 'trainee',
    })

    const { result } = renderHook(() => useSignupMutation(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
    })

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/trainee')
    })
  })
})

describe('useLoginMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls signInWithEmail and sets user/userData in store', async () => {
    const mockUser = { uid: 'login-user' }
    const mockUserDoc = { uid: 'login-user', role: 'trainer' }
    mockSignInWithEmail.mockResolvedValue(mockUser)
    mockGetFullUser.mockResolvedValue(mockUserDoc)

    const { result } = renderHook(() => useLoginMutation(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ email: 'test@test.com', password: '123456' })

    await waitFor(() => {
      expect(mockSignInWithEmail).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: '123456',
      })
    })

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith(mockUser)
      expect(mockSetUserData).toHaveBeenCalledWith(mockUserDoc)
    })
  })

  it('navigates to correct role dashboard', async () => {
    const mockUser = { uid: 'u1' }
    mockSignInWithEmail.mockResolvedValue(mockUser)
    mockGetFullUser.mockResolvedValue({ uid: 'u1', role: 'trainer' })

    const { result } = renderHook(() => useLoginMutation(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ email: 'test@test.com', password: '123456' })

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/trainer')
    })
  })
})

describe('useGoogleLoginMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls signInWithGoogle and sets user data', async () => {
    const mockUser = { uid: 'google-user' }
    mockSignInWithGoogle.mockResolvedValue(mockUser)
    mockGetFullUser.mockResolvedValue({ uid: 'google-user', role: 'trainee' })

    const { result } = renderHook(() => useGoogleLoginMutation(), {
      wrapper: createWrapper(),
    })

    result.current.mutate()

    await waitFor(() => {
      expect(mockSignInWithGoogle).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith(mockUser)
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/trainee')
    })
  })
})

describe('useLogoutMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('clears auth store, removes queries, and navigates to /login', async () => {
    mockLogout.mockResolvedValue(undefined)

    const { result } = renderHook(() => useLogoutMutation(), {
      wrapper: createWrapper(),
    })

    result.current.mutate()

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(mockClearAuth).toHaveBeenCalled()
      expect(mockRemoveQueries).toHaveBeenCalledWith({ queryKey: ['user'] })
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })
})

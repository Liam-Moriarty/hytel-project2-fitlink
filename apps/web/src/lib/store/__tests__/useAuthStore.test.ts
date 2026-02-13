/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../useAuthStore'

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useAuthStore.setState({
      user: null,
      userData: null,
      loading: true,
      isAuthenticated: false,
    })
  })

  describe('initial state', () => {
    it('has null user', () => {
      expect(useAuthStore.getState().user).toBeNull()
    })

    it('has null userData', () => {
      expect(useAuthStore.getState().userData).toBeNull()
    })

    it('has loading set to true', () => {
      expect(useAuthStore.getState().loading).toBe(true)
    })

    it('has isAuthenticated set to false', () => {
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
  })

  describe('setUser', () => {
    it('sets user and isAuthenticated to true, loading to false', () => {
      const mockUser = { uid: 'user-1', email: 'test@test.com' } as any

      useAuthStore.getState().setUser(mockUser)

      const state = useAuthStore.getState()
      expect(state.user).toBe(mockUser)
      expect(state.isAuthenticated).toBe(true)
      expect(state.loading).toBe(false)
    })

    it('sets isAuthenticated to false when user is null', () => {
      // First set a user
      useAuthStore.getState().setUser({ uid: 'user-1' } as any)
      expect(useAuthStore.getState().isAuthenticated).toBe(true)

      // Then clear it
      useAuthStore.getState().setUser(null)

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })
  })

  describe('setUserData', () => {
    it('sets userData correctly', () => {
      const mockUserData = {
        uid: 'user-1',
        email: 'test@test.com',
        displayName: 'Test User',
        role: 'trainee' as const,
        createdAt: new Date(),
      }

      useAuthStore.getState().setUserData(mockUserData)

      expect(useAuthStore.getState().userData).toBe(mockUserData)
    })

    it('can set userData to null', () => {
      useAuthStore
        .getState()
        .setUserData({ uid: 'u1', email: 'e', displayName: 'n', createdAt: new Date() })
      useAuthStore.getState().setUserData(null)

      expect(useAuthStore.getState().userData).toBeNull()
    })
  })

  describe('setLoading', () => {
    it('sets loading to true', () => {
      useAuthStore.getState().setLoading(false)
      useAuthStore.getState().setLoading(true)
      expect(useAuthStore.getState().loading).toBe(true)
    })

    it('sets loading to false', () => {
      useAuthStore.getState().setLoading(false)
      expect(useAuthStore.getState().loading).toBe(false)
    })
  })

  describe('clearAuth', () => {
    it('resets user, userData, and isAuthenticated', () => {
      // Set some state
      useAuthStore.getState().setUser({ uid: 'user-1' } as any)
      useAuthStore.getState().setUserData({
        uid: 'user-1',
        email: 'test@test.com',
        displayName: 'Test',
        createdAt: new Date(),
      })

      // Clear it
      useAuthStore.getState().clearAuth()

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.userData).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Firebase modules before imports
const mockCreateUser = vi.fn()
const mockSignInWithEmailAndPassword = vi.fn()
const mockSignInWithPopup = vi.fn()
const mockSignOut = vi.fn()
const mockUpdateProfile = vi.fn()
const mockSetDoc = vi.fn()
const mockGetDoc = vi.fn()
const mockDoc = vi.fn()

vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: (...args: unknown[]) => mockCreateUser(...args),
  signInWithEmailAndPassword: (...args: unknown[]) => mockSignInWithEmailAndPassword(...args),
  signInWithPopup: (...args: unknown[]) => mockSignInWithPopup(...args),
  GoogleAuthProvider: vi.fn().mockImplementation(() => ({
    setCustomParameters: vi.fn(),
  })),
  signOut: (...args: unknown[]) => mockSignOut(...args),
  updateProfile: (...args: unknown[]) => mockUpdateProfile(...args),
}))

vi.mock('firebase/firestore', () => ({
  doc: (...args: unknown[]) => mockDoc(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
}))

vi.mock('../../firebase', () => ({
  auth: { currentUser: null },
  db: {},
}))

import { signUpWithEmail, signInWithEmail, signInWithGoogle, logout } from '../auth'

describe('signUpWithEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates user, updates profile, creates Firestore doc, and returns user', async () => {
    const mockUser = {
      uid: 'user-123',
      email: 'test@example.com',
    }

    mockCreateUser.mockResolvedValue({ user: mockUser })
    mockUpdateProfile.mockResolvedValue(undefined)
    mockDoc.mockReturnValue('user-doc-ref')
    mockSetDoc.mockResolvedValue(undefined)

    const result = await signUpWithEmail({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    expect(result).toBe(mockUser)
    expect(mockCreateUser).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com',
      'password123'
    )
    expect(mockUpdateProfile).toHaveBeenCalledWith(mockUser, { displayName: 'Test User' })
    expect(mockSetDoc).toHaveBeenCalledWith(
      'user-doc-ref',
      expect.objectContaining({
        uid: 'user-123',
        email: 'test@example.com',
        displayName: 'Test User',
      })
    )
  })

  it('propagates Firebase Auth errors', async () => {
    mockCreateUser.mockRejectedValue(new Error('auth/email-already-in-use'))

    await expect(
      signUpWithEmail({
        name: 'Test',
        email: 'existing@example.com',
        password: 'password123',
      })
    ).rejects.toThrow('auth/email-already-in-use')
  })
})

describe('signInWithEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('signs in and returns user', async () => {
    const mockUser = { uid: 'user-123', email: 'test@example.com' }
    mockSignInWithEmailAndPassword.mockResolvedValue({ user: mockUser })

    const result = await signInWithEmail({
      email: 'test@example.com',
      password: 'password123',
    })

    expect(result).toBe(mockUser)
    expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com',
      'password123'
    )
  })

  it('propagates invalid credentials error', async () => {
    mockSignInWithEmailAndPassword.mockRejectedValue(new Error('auth/invalid-credential'))

    await expect(signInWithEmail({ email: 'bad@example.com', password: 'wrong' })).rejects.toThrow(
      'auth/invalid-credential'
    )
  })
})

describe('signInWithGoogle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('signs in via popup and creates doc if user is new', async () => {
    const mockUser = {
      uid: 'google-123',
      email: 'google@example.com',
      displayName: 'Google User',
    }
    mockSignInWithPopup.mockResolvedValue({ user: mockUser })
    mockDoc.mockReturnValue('user-doc-ref')
    mockGetDoc.mockResolvedValue({ exists: () => false })
    mockSetDoc.mockResolvedValue(undefined)

    const result = await signInWithGoogle()

    expect(result).toBe(mockUser)
    expect(mockSignInWithPopup).toHaveBeenCalled()
    expect(mockGetDoc).toHaveBeenCalledWith('user-doc-ref')
    expect(mockSetDoc).toHaveBeenCalledWith(
      'user-doc-ref',
      expect.objectContaining({
        uid: 'google-123',
        email: 'google@example.com',
        displayName: 'Google User',
      })
    )
  })

  it('skips doc creation if user already exists', async () => {
    const mockUser = { uid: 'google-123', email: 'google@example.com' }
    mockSignInWithPopup.mockResolvedValue({ user: mockUser })
    mockDoc.mockReturnValue('user-doc-ref')
    mockGetDoc.mockResolvedValue({ exists: () => true })

    await signInWithGoogle()

    expect(mockSetDoc).not.toHaveBeenCalled()
  })
})

describe('logout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls signOut', async () => {
    mockSignOut.mockResolvedValue(undefined)

    await logout()

    expect(mockSignOut).toHaveBeenCalled()
  })
})

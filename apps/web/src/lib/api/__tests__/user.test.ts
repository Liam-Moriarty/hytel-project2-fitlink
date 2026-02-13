import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockDoc = vi.fn()
const mockGetDoc = vi.fn()
const mockSetDoc = vi.fn()
const mockUpdateDoc = vi.fn()

vi.mock('firebase/firestore', () => ({
  doc: (...args: unknown[]) => mockDoc(...args),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
}))

vi.mock('../../firebase', () => ({
  db: {},
}))

import {
  userKeys,
  getFullUser,
  updateUser,
  createTraineeGoals,
  updateTraineeGoals,
  createTrainerProfile,
} from '../user'

describe('userKeys', () => {
  it('all returns ["user"]', () => {
    expect(userKeys.all).toEqual(['user'])
  })

  it('detail returns ["user", uid]', () => {
    expect(userKeys.detail('abc-123')).toEqual(['user', 'abc-123'])
  })
})

describe('getFullUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null when user does not exist', async () => {
    mockDoc.mockReturnValue('user-ref')
    mockGetDoc.mockResolvedValue({ exists: () => false })

    const result = await getFullUser('nonexistent')
    expect(result).toBeNull()
  })

  it('returns user data without traineeGoals for non-trainee', async () => {
    const userData = { uid: 'u1', email: 'test@test.com', role: 'trainer' }
    mockDoc.mockReturnValue('user-ref')
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => userData,
    })

    const result = await getFullUser('u1')
    expect(result).toEqual({ ...userData, traineeGoals: null })
  })

  it('returns user data with traineeGoals for trainee', async () => {
    const userData = { uid: 'u2', email: 'trainee@test.com', role: 'trainee' }
    const goalsData = { goals: ['lose weight'], completedWorkouts: [] }

    mockDoc.mockImplementation((_db: unknown, collection: string) => {
      return `${collection}-ref`
    })

    let callCount = 0
    mockGetDoc.mockImplementation(() => {
      callCount++
      if (callCount === 1) {
        return { exists: () => true, data: () => userData }
      }
      return { exists: () => true, data: () => goalsData }
    })

    const result = await getFullUser('u2')
    expect(result).toEqual({ ...userData, traineeGoals: goalsData })
  })

  it('returns user data with null traineeGoals when goals doc missing', async () => {
    const userData = { uid: 'u3', email: 'trainee@test.com', role: 'trainee' }

    mockDoc.mockReturnValue('doc-ref')

    let callCount = 0
    mockGetDoc.mockImplementation(() => {
      callCount++
      if (callCount === 1) {
        return { exists: () => true, data: () => userData }
      }
      return { exists: () => false }
    })

    const result = await getFullUser('u3')
    expect(result).toEqual({ ...userData, traineeGoals: null })
  })
})

describe('updateUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls updateDoc with correct ref and data', async () => {
    mockDoc.mockReturnValue('user-ref')
    mockUpdateDoc.mockResolvedValue(undefined)

    await updateUser('u1', { displayName: 'New Name' })

    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), 'users', 'u1')
    expect(mockUpdateDoc).toHaveBeenCalledWith('user-ref', { displayName: 'New Name' })
  })
})

describe('createTraineeGoals', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls setDoc with userId, data, empty arrays, and createdAt', async () => {
    mockDoc.mockReturnValue('goals-ref')
    mockSetDoc.mockResolvedValue(undefined)

    const data = { goals: ['lose weight'], targetTimeline: '3 months' }
    await createTraineeGoals('u1', data)

    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), 'traineeGoals', 'u1')
    expect(mockSetDoc).toHaveBeenCalledWith(
      'goals-ref',
      expect.objectContaining({
        userId: 'u1',
        goals: ['lose weight'],
        targetTimeline: '3 months',
        completedWorkouts: [],
        completedMeals: [],
      })
    )
    // Verify createdAt is a Date
    const setDocCall = mockSetDoc.mock.calls[0][1]
    expect(setDocCall.createdAt).toBeInstanceOf(Date)
  })
})

describe('updateTraineeGoals', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls updateDoc with correct ref and data', async () => {
    mockDoc.mockReturnValue('goals-ref')
    mockUpdateDoc.mockResolvedValue(undefined)

    await updateTraineeGoals('u1', { completedWorkouts: ['1-1'] })

    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), 'traineeGoals', 'u1')
    expect(mockUpdateDoc).toHaveBeenCalledWith('goals-ref', { completedWorkouts: ['1-1'] })
  })
})

describe('createTrainerProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls setDoc with userId, data, and createdAt', async () => {
    mockDoc.mockReturnValue('trainer-ref')
    mockSetDoc.mockResolvedValue(undefined)

    const data = { specialties: ['HIIT'], certifications: ['ACE'] }
    await createTrainerProfile('u1', data)

    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), 'trainers', 'u1')
    expect(mockSetDoc).toHaveBeenCalledWith(
      'trainer-ref',
      expect.objectContaining({
        userId: 'u1',
        specialties: ['HIIT'],
        certifications: ['ACE'],
      })
    )
    const setDocCall = mockSetDoc.mock.calls[0][1]
    expect(setDocCall.createdAt).toBeInstanceOf(Date)
  })
})

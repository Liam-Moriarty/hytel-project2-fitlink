import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockDoc = vi.fn()
const mockGetDoc = vi.fn()
const mockUpdateDoc = vi.fn()
const mockCollection = vi.fn()
const mockQuery = vi.fn()
const mockWhere = vi.fn()
const mockGetDocs = vi.fn()
const mockArrayUnion = vi.fn()
const mockArrayRemove = vi.fn()

vi.mock('firebase/firestore', () => ({
  doc: (...args: unknown[]) => mockDoc(...args),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
  updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
  collection: (...args: unknown[]) => mockCollection(...args),
  query: (...args: unknown[]) => mockQuery(...args),
  where: (...args: unknown[]) => mockWhere(...args),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  arrayUnion: (...args: unknown[]) => mockArrayUnion(...args),
  arrayRemove: (...args: unknown[]) => mockArrayRemove(...args),
}))

vi.mock('../../firebase', () => ({
  db: {},
}))

import {
  getTrainerProfile,
  getUserByEmail,
  getTrainerClients,
  addTraineeToTrainer,
  removeTraineeFromTrainer,
  updateTrainerProfile,
} from '../trainer'

describe('getTrainerProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null when trainer not found', async () => {
    mockDoc.mockReturnValue('trainer-ref')
    mockGetDoc.mockResolvedValue({ exists: () => false })

    const result = await getTrainerProfile('nonexistent')
    expect(result).toBeNull()
  })

  it('returns TrainerProfile when found', async () => {
    const trainerData = {
      userId: 't1',
      specialties: ['HIIT'],
      certifications: ['ACE'],
      availability: ['Monday'],
      traineeIds: [],
      createdAt: new Date(),
    }
    mockDoc.mockReturnValue('trainer-ref')
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => trainerData,
    })

    const result = await getTrainerProfile('t1')
    expect(result).toEqual(trainerData)
  })
})

describe('getUserByEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns { user: null, exists: false } when no user found', async () => {
    mockCollection.mockReturnValue('users-collection')
    mockWhere.mockReturnValue('email-filter')
    mockQuery.mockReturnValue('email-query')
    mockGetDocs.mockResolvedValue({ empty: true, docs: [] })

    const result = await getUserByEmail('nobody@example.com')
    expect(result).toEqual({ user: null, exists: false })
  })

  it('returns { user: null, exists: true } when user is not a trainee', async () => {
    const userData = { uid: 'u1', email: 'trainer@test.com', role: 'trainer' }
    mockCollection.mockReturnValue('users-collection')
    mockWhere.mockReturnValue('email-filter')
    mockQuery.mockReturnValue('email-query')
    mockGetDocs.mockResolvedValue({
      empty: false,
      docs: [{ data: () => userData }],
    })

    const result = await getUserByEmail('trainer@test.com')
    expect(result).toEqual({ user: null, exists: true })
  })

  it('returns { user, exists: true } when user is a trainee', async () => {
    const userData = { uid: 'u2', email: 'trainee@test.com', role: 'trainee' }
    mockCollection.mockReturnValue('users-collection')
    mockWhere.mockReturnValue('email-filter')
    mockQuery.mockReturnValue('email-query')
    mockGetDocs.mockResolvedValue({
      empty: false,
      docs: [{ data: () => userData }],
    })

    const result = await getUserByEmail('trainee@test.com')
    expect(result).toEqual({ user: userData, exists: true })
  })
})

describe('getTrainerClients', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns empty array for empty traineeIds', async () => {
    const result = await getTrainerClients([])
    expect(result).toEqual([])
  })

  it('returns array of UserData for valid IDs', async () => {
    const user1 = { uid: 'u1', email: 'trainee1@test.com' }
    const user2 = { uid: 'u2', email: 'trainee2@test.com' }

    mockDoc.mockReturnValue('user-ref')
    let callCount = 0
    mockGetDoc.mockImplementation(() => {
      callCount++
      if (callCount === 1) {
        return { exists: () => true, data: () => user1 }
      }
      return { exists: () => true, data: () => user2 }
    })

    const result = await getTrainerClients(['u1', 'u2'])
    expect(result).toEqual([user1, user2])
    expect(result).toHaveLength(2)
  })

  it('skips non-existent users', async () => {
    const user1 = { uid: 'u1', email: 'trainee1@test.com' }

    mockDoc.mockReturnValue('user-ref')
    let callCount = 0
    mockGetDoc.mockImplementation(() => {
      callCount++
      if (callCount === 1) {
        return { exists: () => true, data: () => user1 }
      }
      return { exists: () => false }
    })

    const result = await getTrainerClients(['u1', 'nonexistent'])
    expect(result).toEqual([user1])
    expect(result).toHaveLength(1)
  })
})

describe('addTraineeToTrainer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls updateDoc with arrayUnion', async () => {
    mockDoc.mockReturnValue('trainer-ref')
    mockArrayUnion.mockReturnValue('union-value')
    mockUpdateDoc.mockResolvedValue(undefined)

    await addTraineeToTrainer('t1', 'trainee-1')

    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), 'trainers', 't1')
    expect(mockArrayUnion).toHaveBeenCalledWith('trainee-1')
    expect(mockUpdateDoc).toHaveBeenCalledWith('trainer-ref', {
      traineeIds: 'union-value',
    })
  })
})

describe('removeTraineeFromTrainer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls updateDoc with arrayRemove', async () => {
    mockDoc.mockReturnValue('trainer-ref')
    mockArrayRemove.mockReturnValue('remove-value')
    mockUpdateDoc.mockResolvedValue(undefined)

    await removeTraineeFromTrainer('t1', 'trainee-1')

    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), 'trainers', 't1')
    expect(mockArrayRemove).toHaveBeenCalledWith('trainee-1')
    expect(mockUpdateDoc).toHaveBeenCalledWith('trainer-ref', {
      traineeIds: 'remove-value',
    })
  })
})

describe('updateTrainerProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls updateDoc with partial data', async () => {
    mockDoc.mockReturnValue('trainer-ref')
    mockUpdateDoc.mockResolvedValue(undefined)

    const data = { availability: ['Monday', 'Wednesday'] }
    await updateTrainerProfile('t1', data)

    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), 'trainers', 't1')
    expect(mockUpdateDoc).toHaveBeenCalledWith('trainer-ref', data)
  })
})

import { describe, it, expect } from 'vitest'
import {
  roleSchema,
  userDetailsSchema,
  traineeGoalsSchema,
  trainerSpecialtiesSchema,
  traineeWorkoutSchema,
  trainerCertificationsSchema,
} from '../onboarding'

describe('roleSchema', () => {
  it('accepts trainee role', () => {
    const result = roleSchema.safeParse({ role: 'trainee' })
    expect(result.success).toBe(true)
  })

  it('accepts trainer role', () => {
    const result = roleSchema.safeParse({ role: 'trainer' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid role', () => {
    const result = roleSchema.safeParse({ role: 'admin' })
    expect(result.success).toBe(false)
  })

  it('rejects missing role', () => {
    const result = roleSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

describe('userDetailsSchema', () => {
  const validDetails = {
    gender: 'male',
    age: 25,
    height: 180,
    weight: 75,
    activityLevel: 'moderate',
  }

  it('accepts valid user details', () => {
    const result = userDetailsSchema.safeParse(validDetails)
    expect(result.success).toBe(true)
  })

  it('coerces string numbers to numbers', () => {
    const result = userDetailsSchema.safeParse({
      ...validDetails,
      age: '25',
      height: '180',
      weight: '75',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.age).toBe(25)
      expect(result.data.height).toBe(180)
      expect(result.data.weight).toBe(75)
    }
  })

  it('rejects age less than 1', () => {
    const result = userDetailsSchema.safeParse({ ...validDetails, age: 0 })
    expect(result.success).toBe(false)
  })

  it('rejects age greater than 120', () => {
    const result = userDetailsSchema.safeParse({ ...validDetails, age: 121 })
    expect(result.success).toBe(false)
  })

  it('rejects invalid gender', () => {
    const result = userDetailsSchema.safeParse({ ...validDetails, gender: 'unknown' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid activity level', () => {
    const result = userDetailsSchema.safeParse({ ...validDetails, activityLevel: 'extreme' })
    expect(result.success).toBe(false)
  })

  it('accepts all valid genders', () => {
    for (const gender of ['male', 'female', 'other']) {
      const result = userDetailsSchema.safeParse({ ...validDetails, gender })
      expect(result.success).toBe(true)
    }
  })

  it('accepts all valid activity levels', () => {
    for (const activityLevel of ['sedentary', 'light', 'moderate', 'high']) {
      const result = userDetailsSchema.safeParse({ ...validDetails, activityLevel })
      expect(result.success).toBe(true)
    }
  })
})

describe('traineeGoalsSchema', () => {
  it('accepts at least one goal', () => {
    const result = traineeGoalsSchema.safeParse({ goals: ['lose weight'] })
    expect(result.success).toBe(true)
  })

  it('accepts multiple goals', () => {
    const result = traineeGoalsSchema.safeParse({ goals: ['lose weight', 'gain muscle'] })
    expect(result.success).toBe(true)
  })

  it('rejects empty goals array', () => {
    const result = traineeGoalsSchema.safeParse({ goals: [] })
    expect(result.success).toBe(false)
  })
})

describe('trainerSpecialtiesSchema', () => {
  it('accepts at least one specialty', () => {
    const result = trainerSpecialtiesSchema.safeParse({ specialties: ['HIIT'] })
    expect(result.success).toBe(true)
  })

  it('rejects empty specialties array', () => {
    const result = trainerSpecialtiesSchema.safeParse({ specialties: [] })
    expect(result.success).toBe(false)
  })
})

describe('traineeWorkoutSchema', () => {
  it('accepts at least one workout type', () => {
    const result = traineeWorkoutSchema.safeParse({ preferredWorkoutTypes: ['Running'] })
    expect(result.success).toBe(true)
  })

  it('rejects empty workout types array', () => {
    const result = traineeWorkoutSchema.safeParse({ preferredWorkoutTypes: [] })
    expect(result.success).toBe(false)
  })
})

describe('trainerCertificationsSchema', () => {
  it('accepts at least one certification', () => {
    const result = trainerCertificationsSchema.safeParse({ certifications: ['ACE'] })
    expect(result.success).toBe(true)
  })

  it('rejects empty certifications array', () => {
    const result = trainerCertificationsSchema.safeParse({ certifications: [] })
    expect(result.success).toBe(false)
  })
})

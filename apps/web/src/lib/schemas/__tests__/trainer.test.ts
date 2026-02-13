import { describe, it, expect } from 'vitest'
import {
  inviteEmailSchema,
  availabilitySchema,
  certificationsSchema,
  trainerPersonalInfoSchema,
  specialtiesSchema,
} from '../trainer'

describe('inviteEmailSchema', () => {
  it('accepts valid email', () => {
    const result = inviteEmailSchema.safeParse({ email: 'user@example.com' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = inviteEmailSchema.safeParse({ email: 'not-an-email' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Please enter a valid email address')
    }
  })

  it('rejects empty email', () => {
    const result = inviteEmailSchema.safeParse({ email: '' })
    expect(result.success).toBe(false)
  })
})

describe('availabilitySchema', () => {
  it('accepts at least one day', () => {
    const result = availabilitySchema.safeParse({ availability: ['Monday'] })
    expect(result.success).toBe(true)
  })

  it('accepts multiple days', () => {
    const result = availabilitySchema.safeParse({
      availability: ['Monday', 'Wednesday', 'Friday'],
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty availability array', () => {
    const result = availabilitySchema.safeParse({ availability: [] })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Please select at least one day')
    }
  })
})

describe('certificationsSchema', () => {
  it('accepts at least one certification', () => {
    const result = certificationsSchema.safeParse({ certifications: ['ACE'] })
    expect(result.success).toBe(true)
  })

  it('rejects empty certifications array', () => {
    const result = certificationsSchema.safeParse({ certifications: [] })
    expect(result.success).toBe(false)
  })
})

describe('trainerPersonalInfoSchema', () => {
  const validData = {
    age: '30',
    gender: 'male' as const,
    height: '180',
    weight: '80',
    activityLevel: 'high' as const,
  }

  it('accepts valid personal info', () => {
    const result = trainerPersonalInfoSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('rejects empty age', () => {
    const result = trainerPersonalInfoSchema.safeParse({ ...validData, age: '' })
    expect(result.success).toBe(false)
  })

  it('rejects empty height', () => {
    const result = trainerPersonalInfoSchema.safeParse({ ...validData, height: '' })
    expect(result.success).toBe(false)
  })

  it('rejects empty weight', () => {
    const result = trainerPersonalInfoSchema.safeParse({ ...validData, weight: '' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid gender', () => {
    const result = trainerPersonalInfoSchema.safeParse({ ...validData, gender: 'unknown' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid activity level', () => {
    const result = trainerPersonalInfoSchema.safeParse({ ...validData, activityLevel: 'extreme' })
    expect(result.success).toBe(false)
  })

  it('accepts all valid genders', () => {
    for (const gender of ['male', 'female', 'other']) {
      const result = trainerPersonalInfoSchema.safeParse({ ...validData, gender })
      expect(result.success).toBe(true)
    }
  })

  it('accepts all valid activity levels', () => {
    for (const activityLevel of ['sedentary', 'light', 'moderate', 'high']) {
      const result = trainerPersonalInfoSchema.safeParse({ ...validData, activityLevel })
      expect(result.success).toBe(true)
    }
  })
})

describe('specialtiesSchema', () => {
  it('accepts at least one specialty', () => {
    const result = specialtiesSchema.safeParse({ specialties: ['Strength Training'] })
    expect(result.success).toBe(true)
  })

  it('rejects empty specialties array', () => {
    const result = specialtiesSchema.safeParse({ specialties: [] })
    expect(result.success).toBe(false)
  })
})

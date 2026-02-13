import { describe, it, expect } from 'vitest'
import { loginSchema, signupSchema } from '../auth'

describe('loginSchema', () => {
  it('accepts valid email and password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: '123456',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: '123456',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Invalid email address')
    }
  })

  it('rejects password shorter than 6 characters', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: '12345',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Password must be at least 6 characters')
    }
  })

  it('rejects empty email', () => {
    const result = loginSchema.safeParse({
      email: '',
      password: '123456',
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing fields', () => {
    const result = loginSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

describe('signupSchema', () => {
  it('accepts valid name, email, and password', () => {
    const result = signupSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })
    expect(result.success).toBe(true)
  })

  it('rejects name shorter than 2 characters', () => {
    const result = signupSchema.safeParse({
      name: 'J',
      email: 'john@example.com',
      password: '123456',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Name must be at least 2 characters')
    }
  })

  it('rejects invalid email in signup', () => {
    const result = signupSchema.safeParse({
      name: 'John',
      email: 'invalid',
      password: '123456',
    })
    expect(result.success).toBe(false)
  })

  it('rejects short password in signup', () => {
    const result = signupSchema.safeParse({
      name: 'John',
      email: 'john@example.com',
      password: '123',
    })
    expect(result.success).toBe(false)
  })
})

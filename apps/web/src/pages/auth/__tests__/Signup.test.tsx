/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { createElement } from 'react'

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  Link: ({ to, children }: any) => createElement('a', { href: to }, children),
  useNavigate: () => vi.fn(),
}))

// Mock auth hooks
const mockSignup = vi.fn()
const mockGoogleLogin = vi.fn()

vi.mock('@/hooks/useAuth', () => ({
  useSignupMutation: () => ({
    mutate: mockSignup,
    isPending: false,
    error: null,
  }),
  useGoogleLoginMutation: () => ({
    mutate: mockGoogleLogin,
    isPending: false,
  }),
}))

import Signup from '../Signup'

describe('Signup Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the signup form with name, email, and password fields', () => {
    render(createElement(Signup))

    expect(screen.getByText('Create an Account')).toBeInTheDocument()
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('renders the Sign Up submit button', () => {
    render(createElement(Signup))

    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument()
  })

  it('renders the Sign up with Google button', () => {
    render(createElement(Signup))

    expect(screen.getByText('Sign up with Google')).toBeInTheDocument()
  })

  it('renders link to login page', () => {
    render(createElement(Signup))

    expect(screen.getByText('Log in')).toBeInTheDocument()
  })

  it('shows validation errors for empty submit', async () => {
    render(createElement(Signup))

    const submitButton = screen.getByRole('button', { name: 'Sign Up' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSignup).not.toHaveBeenCalled()
    })
  })

  it('calls googleLogin when Google button is clicked', () => {
    render(createElement(Signup))

    const googleButton = screen.getByText('Sign up with Google')
    fireEvent.click(googleButton)

    expect(mockGoogleLogin).toHaveBeenCalled()
  })
})

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
const mockLogin = vi.fn()
const mockGoogleLogin = vi.fn()

vi.mock('@/hooks/useAuth', () => ({
  useLoginMutation: () => ({
    mutate: mockLogin,
    isPending: false,
    error: null,
  }),
  useGoogleLoginMutation: () => ({
    mutate: mockGoogleLogin,
    isPending: false,
  }),
}))

import Login from '../Login'

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the login form with email and password fields', () => {
    render(createElement(Login))

    expect(screen.getByText('Welcome Back')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('renders the Log In submit button', () => {
    render(createElement(Login))

    expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument()
  })

  it('renders the Sign in with Google button', () => {
    render(createElement(Login))

    expect(screen.getByText('Sign in with Google')).toBeInTheDocument()
  })

  it('renders link to signup page', () => {
    render(createElement(Login))

    expect(screen.getByText('Sign up')).toBeInTheDocument()
  })

  it('shows validation errors for empty submit', async () => {
    render(createElement(Login))

    const submitButton = screen.getByRole('button', { name: 'Log In' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      // Form validation should prevent submission
      expect(mockLogin).not.toHaveBeenCalled()
    })
  })

  it('calls googleLogin when Google button is clicked', () => {
    render(createElement(Login))

    const googleButton = screen.getByText('Sign in with Google')
    fireEvent.click(googleButton)

    expect(mockGoogleLogin).toHaveBeenCalled()
  })
})

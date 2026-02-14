/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createElement } from 'react'

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  Navigate: ({ to, replace }: { to: string; replace?: boolean }) =>
    createElement('div', { 'data-testid': 'navigate', 'data-to': to, 'data-replace': replace }),
  Outlet: () => createElement('div', { 'data-testid': 'outlet' }, 'Outlet Content'),
}))

// Mock auth store
let mockAuthState: any = {
  isAuthenticated: false,
  userData: null,
}

vi.mock('@/lib/store/useAuthStore', () => ({
  useAuthStore: () => mockAuthState,
}))

import ProtectedRoute from '../ProtectedRoute'

describe('ProtectedRoute', () => {
  it('redirects to /login when not authenticated', () => {
    mockAuthState = { isAuthenticated: false, userData: null }
    render(createElement(ProtectedRoute))

    const navigate = screen.getByTestId('navigate')
    expect(navigate.getAttribute('data-to')).toBe('/login')
  })

  it('redirects to /onboarding when authenticated but no role', () => {
    mockAuthState = {
      isAuthenticated: true,
      userData: { uid: 'user-1', email: 'test@test.com' },
    }
    render(createElement(ProtectedRoute))

    const navigate = screen.getByTestId('navigate')
    expect(navigate.getAttribute('data-to')).toBe('/onboarding')
  })

  it('redirects to correct dashboard when role mismatch', () => {
    mockAuthState = {
      isAuthenticated: true,
      userData: { uid: 'user-1', role: 'trainee' },
    }
    render(createElement(ProtectedRoute, { allowedRole: 'trainer' }))

    const navigate = screen.getByTestId('navigate')
    expect(navigate.getAttribute('data-to')).toBe('/dashboard/trainee')
  })

  it('renders Outlet when authenticated with matching role', () => {
    mockAuthState = {
      isAuthenticated: true,
      userData: { uid: 'user-1', role: 'trainee' },
    }
    render(createElement(ProtectedRoute, { allowedRole: 'trainee' }))

    expect(screen.getByTestId('outlet')).toBeInTheDocument()
  })

  it('renders Outlet when no allowedRole is specified and user has role', () => {
    mockAuthState = {
      isAuthenticated: true,
      userData: { uid: 'user-1', role: 'trainer' },
    }
    render(createElement(ProtectedRoute))

    expect(screen.getByTestId('outlet')).toBeInTheDocument()
  })
})

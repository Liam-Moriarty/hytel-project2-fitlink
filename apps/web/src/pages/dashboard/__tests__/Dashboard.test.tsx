/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createElement } from 'react'

// Mock dependencies
const mockOutlet = () => createElement('div', { 'data-testid': 'outlet' }, 'Outlet Content')

vi.mock('react-router-dom', () => ({
  Outlet: () => mockOutlet(),
}))

vi.mock('@/components/TraineeSidebar', () => ({
  default: () => createElement('div', { 'data-testid': 'trainee-sidebar' }),
}))

vi.mock('@/components/TrainerSidebar', () => ({
  default: () => createElement('div', { 'data-testid': 'trainer-sidebar' }),
}))

vi.mock('@/components/ui/sidebar', () => ({
  SidebarProvider: ({ children }: any) =>
    createElement('div', { 'data-testid': 'sidebar-provider' }, children),
  SidebarInset: ({ children }: any) =>
    createElement('div', { 'data-testid': 'sidebar-inset' }, children),
}))

let mockAuthState: any = { userData: null }

vi.mock('@/lib/store/useAuthStore', () => ({
  useAuthStore: () => mockAuthState,
}))

import Dashboard from '../Dashboard'

describe('Dashboard', () => {
  it('renders TraineeSidebar when user role is trainee', () => {
    mockAuthState = { userData: { role: 'trainee' } }
    render(createElement(Dashboard))

    expect(screen.getByTestId('trainee-sidebar')).toBeInTheDocument()
    expect(screen.queryByTestId('trainer-sidebar')).not.toBeInTheDocument()
  })

  it('renders TrainerSidebar when user role is trainer', () => {
    mockAuthState = { userData: { role: 'trainer' } }
    render(createElement(Dashboard))

    expect(screen.getByTestId('trainer-sidebar')).toBeInTheDocument()
    expect(screen.queryByTestId('trainee-sidebar')).not.toBeInTheDocument()
  })

  it('renders TrainerSidebar when role is undefined (fallback)', () => {
    mockAuthState = { userData: {} }
    render(createElement(Dashboard))

    // No role means userRole !== 'trainee', so TrainerSidebar renders
    expect(screen.getByTestId('trainer-sidebar')).toBeInTheDocument()
  })

  it('renders the outlet for child routes', () => {
    mockAuthState = { userData: { role: 'trainee' } }
    render(createElement(Dashboard))

    expect(screen.getByTestId('outlet')).toBeInTheDocument()
  })

  it('renders within SidebarProvider and SidebarInset', () => {
    mockAuthState = { userData: { role: 'trainee' } }
    render(createElement(Dashboard))

    expect(screen.getByTestId('sidebar-provider')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar-inset')).toBeInTheDocument()
  })
})

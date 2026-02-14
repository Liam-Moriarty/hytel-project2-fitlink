/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createElement } from 'react'

vi.mock('firebase/auth', () => ({
  getAuth: () => ({ currentUser: { uid: 'trainer-1' } }),
}))

vi.mock('@tanstack/react-query', () => ({
  useQuery: ({ queryKey }: any) => {
    if (queryKey[0] === 'trainerProfile') {
      return { data: { traineeIds: ['t1'], availability: ['Monday'], certifications: ['CPT'] } }
    }
    if (queryKey[0] === 'trainerClients') {
      return {
        data: [{ uid: 't1', displayName: 'Client 1', email: 'c1@test.com' }],
        isLoading: false,
      }
    }
    return { data: null }
  },
}))

vi.mock('@/lib/api/trainer', () => ({
  getTrainerProfile: vi.fn(),
  getTrainerClients: vi.fn(),
}))

vi.mock('@/sections/trainer/clients/Header', () => ({
  default: ({ clientCount }: any) =>
    createElement('div', { 'data-testid': 'header' }, `Clients: ${clientCount}`),
}))
vi.mock('@/sections/trainer/clients/InviteCard', () => ({
  default: () => createElement('div', { 'data-testid': 'invite-card' }),
}))
vi.mock('@/sections/trainer/clients/ClientsTable', () => ({
  default: ({ clients }: any) =>
    createElement('div', { 'data-testid': 'clients-table' }, `${clients.length} clients`),
}))

import Clients from '../Clients'

describe('Clients', () => {
  it('renders all section components', () => {
    render(createElement(Clients))

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('invite-card')).toBeInTheDocument()
    expect(screen.getByTestId('clients-table')).toBeInTheDocument()
  })

  it('displays correct client count', () => {
    render(createElement(Clients))
    expect(screen.getByText('Clients: 1')).toBeInTheDocument()
  })

  it('passes clients data to ClientsTable', () => {
    render(createElement(Clients))
    expect(screen.getByText('1 clients')).toBeInTheDocument()
  })
})

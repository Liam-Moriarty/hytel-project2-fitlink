/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createElement } from 'react'

vi.mock('firebase/auth', () => ({
  getAuth: () => ({ currentUser: { uid: 'trainer-1' } }),
}))

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({
    data: {
      availability: ['Monday', 'Wednesday', 'Friday'],
      certifications: ['CPT', 'CSCS'],
    },
  }),
}))

vi.mock('@/lib/api/trainer', () => ({
  getTrainerProfile: vi.fn(),
}))

vi.mock('@/sections/trainer/schedule/Header', () => ({
  default: ({ availableDaysCount }: any) =>
    createElement('div', { 'data-testid': 'header' }, `${availableDaysCount} days`),
}))
vi.mock('@/sections/trainer/schedule/AvailabilityCard', () => ({
  default: ({ availability }: any) =>
    createElement('div', { 'data-testid': 'availability' }, `${availability.length} available`),
}))
vi.mock('@/sections/trainer/schedule/CertificationsCard', () => ({
  default: ({ certifications }: any) =>
    createElement('div', { 'data-testid': 'certifications' }, `${certifications.length} certs`),
}))

import Schedule from '../Schedule'

describe('Schedule', () => {
  it('renders all section components', () => {
    render(createElement(Schedule))

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('availability')).toBeInTheDocument()
    expect(screen.getByTestId('certifications')).toBeInTheDocument()
  })

  it('passes correct availability count to Header', () => {
    render(createElement(Schedule))
    expect(screen.getByText('3 days')).toBeInTheDocument()
  })

  it('passes availability data to AvailabilityCard', () => {
    render(createElement(Schedule))
    expect(screen.getByText('3 available')).toBeInTheDocument()
  })

  it('passes certifications data to CertificationsCard', () => {
    render(createElement(Schedule))
    expect(screen.getByText('2 certs')).toBeInTheDocument()
  })
})

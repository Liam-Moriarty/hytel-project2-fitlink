/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createElement } from 'react'

// Mock Firebase & Router
vi.mock('firebase/auth', () => ({
  getAuth: () => ({ currentUser: { uid: 'trainer-1' } }),
}))
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}))
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  getFirestore: vi.fn(),
  db: {},
}))

// Mock API
vi.mock('@/lib/api/trainer', () => ({
  getTrainerProfile: vi.fn(),
  getTrainerClients: vi.fn(),
}))
vi.mock('@/lib/api/trainer-analytics', () => ({
  generateAnalyticsDataset: (client: any) => ({
    userId: client.uid,
    totalWorkoutsCompleted: 10,
    totalCaloriesBurned: 2000,
    progressPercentage: 75,
  }),
}))

// Mock React Query
vi.mock('@tanstack/react-query', () => ({
  useQuery: ({ queryKey }: any) => {
    if (queryKey[0] === 'trainerProfile') return { data: { traineeIds: ['c1'] } }
    if (queryKey[0] === 'trainerClients') return { data: [{ uid: 'c1' }] }
    if (queryKey[0] === 'allClientsAnalyticsData') return { data: [{ uid: 'c1', role: 'trainee' }] }
    if (queryKey[0] === 'user') return { data: { displayName: 'Trainer Joe' } }
    return { data: null }
  },
}))

// Mock Sections
vi.mock('@/sections/trainer/dashboard/TrainerHeader', () => ({
  default: ({ userData }: any) =>
    createElement('div', { 'data-testid': 'header' }, userData?.displayName),
}))
vi.mock('@/sections/trainer/dashboard/TrainerStatsGrid', () => ({
  default: ({ totalClients }: any) =>
    createElement('div', { 'data-testid': 'stats-grid' }, `Clients: ${totalClients}`),
}))
vi.mock('@/sections/trainer/dashboard/ClientProgressSummary', () => ({
  default: () => createElement('div', { 'data-testid': 'client-progress' }),
}))
vi.mock('@/sections/trainer/dashboard/DietaryProgressSummary', () => ({
  default: () => createElement('div', { 'data-testid': 'dietary-progress' }),
}))
vi.mock('@/sections/trainer/dashboard/ScheduleOverview', () => ({
  default: () => createElement('div', { 'data-testid': 'schedule-overview' }),
}))
vi.mock('@/sections/trainer/dashboard/QuickActions', () => ({
  default: () => createElement('div', { 'data-testid': 'quick-actions' }),
}))
vi.mock('@/sections/trainer/dashboard/CalorieBurnChartSummary', () => ({
  default: () => createElement('div', { 'data-testid': 'calorie-chart' }),
}))

import TrainerDashboard from '../TrainerDashboard'

describe('TrainerDashboard', () => {
  it('renders all dashboard sections', () => {
    render(createElement(TrainerDashboard))

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('stats-grid')).toBeInTheDocument()
    expect(screen.getByTestId('client-progress')).toBeInTheDocument()
    expect(screen.getByTestId('dietary-progress')).toBeInTheDocument()
    expect(screen.getByTestId('schedule-overview')).toBeInTheDocument()
    expect(screen.getByTestId('quick-actions')).toBeInTheDocument()
    expect(screen.getByTestId('calorie-chart')).toBeInTheDocument()
  })

  it('displays correct aggregated stats', () => {
    render(createElement(TrainerDashboard))
    expect(screen.getByText('Clients: 1')).toBeInTheDocument()
  })

  it('displays user greeting', () => {
    render(createElement(TrainerDashboard))
    expect(screen.getByText('Trainer Joe')).toBeInTheDocument()
  })
})

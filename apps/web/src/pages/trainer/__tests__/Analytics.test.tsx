/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { createElement } from 'react'

// Mock Firebase
vi.mock('firebase/auth', () => ({
  getAuth: () => ({ currentUser: { uid: 'trainer-1' } }),
}))

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  getFirestore: vi.fn(),
  db: {},
}))

// Mock API and Utils
vi.mock('@/lib/api/trainer', () => ({
  getTrainerProfile: vi.fn(),
  getTrainerClients: vi.fn(),
}))

vi.mock('@/lib/api/trainer-analytics', () => ({
  generateAnalyticsDataset: (client: any) => ({
    userId: client.uid,
    userName: client.displayName,
    currentWeek: 2,
    totalWorkoutsCompleted: 5,
    totalCaloriesBurned: 1500,
    progressPercentage: 50,
    weeklyCalories: [
      { weekNumber: 1, caloriesBurned: 500 },
      { weekNumber: 2, caloriesBurned: 1000 },
    ],
    weeklyDietaryAdherence: [
      { weekNumber: 1, adherencePercentage: 80 },
      { weekNumber: 2, adherencePercentage: 90 },
    ],
    dietaryAdherencePercentage: 85,
  }),
}))

// Mock React Query
vi.mock('@tanstack/react-query', () => ({
  useQuery: ({ queryKey }: any) => {
    if (queryKey[0] === 'trainerProfile') {
      return { data: { traineeIds: ['t1', 't2'] }, isLoading: false }
    }
    if (queryKey[0] === 'trainerClients') {
      return {
        data: [
          { uid: 't1', displayName: 'Client One' },
          { uid: 't2', displayName: 'Client Two' },
        ],
        isLoading: false,
      }
    }
    if (queryKey[0] === 'selectedTraineesData') {
      return {
        data: [{ uid: 't1', displayName: 'Client One', role: 'trainee' }],
        isLoading: false,
      }
    }
    return { data: null, isLoading: false }
  },
}))

// Mock Section Components
vi.mock('@/sections/trainer/analytics/Header', () => ({
  default: () => createElement('div', { 'data-testid': 'header' }, 'Analytics Header'),
}))
vi.mock('@/sections/trainer/analytics/TrainerSelector', () => ({
  default: ({ onTraineeSelect, selectedTrainees }: any) =>
    createElement(
      'div',
      { 'data-testid': 'trainee-selector' },
      createElement('button', { onClick: () => onTraineeSelect('t1') }, 'Select T1'),
      createElement('div', { 'data-testid': 'selected-count' }, selectedTrainees.length)
    ),
}))
vi.mock('@/sections/trainer/analytics/StatsGrid', () => ({
  default: ({ aggregateStats }: any) =>
    createElement(
      'div',
      { 'data-testid': 'stats-grid' },
      `Total Workouts: ${aggregateStats.totalWorkouts}`
    ),
}))
vi.mock('@/sections/trainer/analytics/ProgressLineChart', () => ({
  default: () => createElement('div', { 'data-testid': 'progress-chart' }),
}))
vi.mock('@/sections/trainer/analytics/IndividualTraineeDetails', () => ({
  default: () => createElement('div', { 'data-testid': 'individual-details' }),
}))

import Analytics from '../Analytics'

describe('Analytics Page', () => {
  it('renders header and selector initially', () => {
    render(createElement(Analytics))
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('trainee-selector')).toBeInTheDocument()
  })

  it('selects a trainee and shows stats', async () => {
    render(createElement(Analytics))

    // Initially stats grid is hidden because no trainee selected
    expect(screen.queryByTestId('stats-grid')).not.toBeInTheDocument()

    // Click to select trainee
    fireEvent.click(screen.getByText('Select T1'))

    // Stats grid should appear
    await waitFor(() => {
      expect(screen.getByTestId('stats-grid')).toBeInTheDocument()
    })

    // Check aggregated stats from mock
    expect(screen.getByText('Total Workouts: 5')).toBeInTheDocument()

    // Charts and details should also be visible
    expect(screen.getByTestId('progress-chart')).toBeInTheDocument()
    expect(screen.getByTestId('individual-details')).toBeInTheDocument()
  })
})

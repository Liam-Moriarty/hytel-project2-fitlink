/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createElement } from 'react'

// Mock Firebase
vi.mock('firebase/auth', () => ({
  getAuth: () => ({ currentUser: { uid: 'user-1' } }),
}))

vi.mock('@/hooks/useUser', () => ({
  useCurrentUser: () => ({
    data: {
      uid: 'user-1',
      traineeGoals: {
        targetTimeline: '3_months',
        completedWorkouts: ['1-1'],
      },
    },
    isLoading: false,
  }),
  useUpdateTraineeGoals: () => ({
    mutate: vi.fn(),
  }),
}))

vi.mock('@/constants/month1TraineeWorkoutPlan', () => ({
  month1TraineeWorkoutPlan: { workoutPlan: [] },
}))
vi.mock('@/constants/month3TraineeWorkoutPlan', () => ({
  month3TraineeWorkoutPlan: {
    workoutPlan: [{ weekNumber: 1, schedule: [{ day: 1 }, { day: 2 }, { day: 3 }] }],
  },
}))
vi.mock('@/constants/month6TraineeWorkoutPlan', () => ({
  month6TraineeWorkoutPlan: { workoutPlan: [] },
}))

vi.mock('@/sections/trainee/workout-plan/Header', () => ({
  default: ({ completedCount, totalWorkouts }: any) =>
    createElement('div', { 'data-testid': 'header' }, `${completedCount}/${totalWorkouts}`),
}))
vi.mock('@/sections/trainee/workout-plan/GoalsCard', () => ({
  default: () => createElement('div', { 'data-testid': 'goals-card' }),
}))
vi.mock('@/sections/trainee/workout-plan/WorkoutTabs', () => ({
  default: () => createElement('div', { 'data-testid': 'workout-tabs' }),
}))
vi.mock('@/sections/trainee/workout-plan/Footer', () => ({
  default: () => createElement('div', { 'data-testid': 'footer' }),
}))

import WorkoutPlan from '../WorkoutPlan'

describe('WorkoutPlan', () => {
  it('renders all section components', () => {
    render(createElement(WorkoutPlan))

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('goals-card')).toBeInTheDocument()
    expect(screen.getByTestId('workout-tabs')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('calculates progress percentage and passes to header', () => {
    render(createElement(WorkoutPlan))
    // 1 completed out of 3 total
    expect(screen.getByText('1/3')).toBeInTheDocument()
  })
})

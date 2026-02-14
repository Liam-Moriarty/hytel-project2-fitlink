/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createElement } from 'react'

// Mock hooks and section components
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}))

vi.mock('@/hooks/useUser', () => ({
  useCurrentUser: () => ({
    data: {
      uid: 'user-1',
      displayName: 'Test User',
      traineeGoals: {
        targetTimeline: '3_months',
        completedWorkouts: ['1-1', '1-2'],
        completedMeals: ['1-1'],
      },
    },
    isLoading: false,
  }),
}))

vi.mock('@/constants', () => ({
  getAchievements: () => [
    { id: 1, title: 'First Workout', active: true },
    { id: 2, title: 'Week Warrior', active: false },
  ],
}))

vi.mock('@/constants/month1TraineeWorkoutPlan', () => ({
  month1TraineeWorkoutPlan: { workoutPlan: [], dietaryPlan: [] },
}))

vi.mock('@/constants/month3TraineeWorkoutPlan', () => ({
  month3TraineeWorkoutPlan: {
    workoutPlan: [
      {
        weekNumber: 1,
        schedule: [
          { day: 1, caloriesBurned: 300 },
          { day: 2, caloriesBurned: 200 },
        ],
      },
    ],
    dietaryPlan: [{ weekNumber: 1, days: [{ day: 1 }, { day: 2 }] }],
  },
}))

vi.mock('@/constants/month6TraineeWorkoutPlan', () => ({
  month6TraineeWorkoutPlan: { workoutPlan: [], dietaryPlan: [] },
}))

// Mock all section components
vi.mock('@/sections/trainee/dashboard/Header', () => ({
  default: ({ userData }: any) =>
    createElement('div', { 'data-testid': 'header' }, userData?.displayName),
}))
vi.mock('@/sections/trainee/dashboard/TraineeTopStatsGrid', () => ({
  default: ({ totalCompleted }: any) =>
    createElement('div', { 'data-testid': 'stats-grid' }, `Completed: ${totalCompleted}`),
}))
vi.mock('@/sections/trainee/dashboard/TodayWorkout', () => ({
  default: () => createElement('div', { 'data-testid': 'today-workout' }),
}))
vi.mock('@/sections/trainee/dashboard/WeekProgress', () => ({
  default: () => createElement('div', { 'data-testid': 'week-progress' }),
}))
vi.mock('@/sections/trainee/dashboard/GoalsOverview', () => ({
  default: () => createElement('div', { 'data-testid': 'goals-overview' }),
}))
vi.mock('@/sections/trainee/dashboard/TraineeAchievements', () => ({
  default: () => createElement('div', { 'data-testid': 'achievements' }),
}))
vi.mock('@/sections/trainee/dashboard/MotivationCard', () => ({
  default: () => createElement('div', { 'data-testid': 'motivation-card' }),
}))
vi.mock('@/sections/trainee/dashboard/DietarySummaryCard', () => ({
  default: () => createElement('div', { 'data-testid': 'dietary-summary' }),
}))

import DashboardHome from '../DashboardHome'

describe('DashboardHome', () => {
  it('renders all section components', () => {
    render(createElement(DashboardHome))

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('stats-grid')).toBeInTheDocument()
    expect(screen.getByTestId('today-workout')).toBeInTheDocument()
    expect(screen.getByTestId('week-progress')).toBeInTheDocument()
    expect(screen.getByTestId('goals-overview')).toBeInTheDocument()
    expect(screen.getByTestId('achievements')).toBeInTheDocument()
    expect(screen.getByTestId('motivation-card')).toBeInTheDocument()
    expect(screen.getByTestId('dietary-summary')).toBeInTheDocument()
  })

  it('displays user name in header', () => {
    render(createElement(DashboardHome))
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('calculates completed workouts count', () => {
    render(createElement(DashboardHome))
    expect(screen.getByText('Completed: 2')).toBeInTheDocument()
  })
})

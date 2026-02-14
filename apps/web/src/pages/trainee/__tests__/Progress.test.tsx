/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createElement } from 'react'

vi.mock('@/hooks/useUser', () => ({
  useCurrentUser: () => ({
    data: {
      uid: 'user-1',
      traineeGoals: {
        targetTimeline: '3_months',
        completedWorkouts: ['1-1', '1-2', '1-3'],
        completedMeals: ['1-1'],
      },
    },
    isLoading: false,
  }),
}))

vi.mock('@/constants', () => ({
  getAchievements: (count: number) => [{ id: 1, title: 'First Workout', active: count >= 1 }],
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
          { day: 3, caloriesBurned: 250 },
        ],
      },
    ],
    dietaryPlan: [
      {
        weekNumber: 1,
        days: [
          { day: 1, totalCalories: 2100 },
          { day: 2, totalCalories: 2200 },
        ],
      },
    ],
  },
}))
vi.mock('@/constants/month6TraineeWorkoutPlan', () => ({
  month6TraineeWorkoutPlan: { workoutPlan: [], dietaryPlan: [] },
}))

vi.mock('@/sections/trainee/progress/Header', () => ({
  default: () => createElement('div', { 'data-testid': 'header' }),
}))
vi.mock('@/sections/trainee/progress/TopStatsGrid', () => ({
  default: ({ totalCompleted, totalBurned }: any) =>
    createElement(
      'div',
      { 'data-testid': 'top-stats' },
      `${totalCompleted} completed, ${totalBurned} cal`
    ),
}))
vi.mock('@/sections/trainee/progress/WeeklyActivity', () => ({
  default: () => createElement('div', { 'data-testid': 'weekly-activity' }),
}))
vi.mock('@/sections/trainee/progress/BodyMeasurements', () => ({
  default: () => createElement('div', { 'data-testid': 'body-measurements' }),
}))
vi.mock('@/sections/trainee/progress/Achievements', () => ({
  default: () => createElement('div', { 'data-testid': 'achievements' }),
}))
vi.mock('@/sections/trainee/progress/DietaryStatsCard', () => ({
  default: ({ completedMealDays }: any) =>
    createElement('div', { 'data-testid': 'dietary-stats' }, `Meals: ${completedMealDays}`),
}))
vi.mock('@/sections/trainee/progress/WeeklyDietaryActivity', () => ({
  default: () => createElement('div', { 'data-testid': 'dietary-activity' }),
}))

import ProgressPage from '../Progress'

describe('ProgressPage', () => {
  it('renders all section components', () => {
    render(createElement(ProgressPage))

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('top-stats')).toBeInTheDocument()
    expect(screen.getByTestId('weekly-activity')).toBeInTheDocument()
    expect(screen.getByTestId('body-measurements')).toBeInTheDocument()
    expect(screen.getByTestId('achievements')).toBeInTheDocument()
    expect(screen.getByTestId('dietary-stats')).toBeInTheDocument()
    expect(screen.getByTestId('dietary-activity')).toBeInTheDocument()
  })

  it('calculates correct completed count and burned calories', () => {
    render(createElement(ProgressPage))
    // 3 completed workouts (1-1, 1-2, 1-3), burned: 300+200+250=750
    expect(screen.getByText('3 completed, 750 cal')).toBeInTheDocument()
  })

  it('calculates dietary progress correctly', () => {
    render(createElement(ProgressPage))
    // 1 completed meal day
    expect(screen.getByText('Meals: 1')).toBeInTheDocument()
  })
})

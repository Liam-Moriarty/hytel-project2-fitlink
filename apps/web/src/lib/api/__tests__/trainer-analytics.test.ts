import { describe, it, expect } from 'vitest'
import {
  calculateWeeklyCalories,
  calculateDietaryProgress,
  calculateWeeklyDietaryAdherence,
  generateAnalyticsDataset,
} from '../trainer-analytics'
import { UserData } from '@/interface'

// Helper to create test userData
const createUserData = (overrides: Partial<UserData> = {}): UserData => ({
  uid: 'test-user',
  email: 'test@example.com',
  displayName: 'Test User',
  createdAt: new Date(),
  traineeGoals: {
    targetTimeline: '1 month',
    completedWorkouts: [],
    completedMeals: [],
  },
  ...overrides,
})

describe('calculateWeeklyCalories', () => {
  it('returns all zeros with no completed workouts', () => {
    const userData = createUserData()
    const result = calculateWeeklyCalories(userData)

    expect(result.length).toBeGreaterThan(0)
    for (const week of result) {
      expect(week.caloriesBurned).toBe(0)
      expect(week.workoutsCompleted).toBe(0)
    }
  })

  it('correctly sums calories for completed workouts', () => {
    const userData = createUserData({
      traineeGoals: {
        targetTimeline: '1 month',
        completedWorkouts: ['1-1', '1-2'], // Week 1, day 1 and day 2
        completedMeals: [],
      },
    })

    const result = calculateWeeklyCalories(userData)

    // Week 1 of month1 plan: day 1 = 320 cal, day 2 = 250 cal
    expect(result[0].weekNumber).toBe(1)
    expect(result[0].caloriesBurned).toBe(320 + 250)
    expect(result[0].workoutsCompleted).toBe(2)
  })

  it('uses 1-month plan for "1 month" timeline', () => {
    const userData = createUserData({
      traineeGoals: {
        targetTimeline: '1 month',
        completedWorkouts: [],
        completedMeals: [],
      },
    })

    const result = calculateWeeklyCalories(userData)
    // 1-month plan has 4 weeks
    expect(result).toHaveLength(4)
  })

  it('uses 6-month plan for "6 months" timeline', () => {
    const userData = createUserData({
      traineeGoals: {
        targetTimeline: '6 months',
        completedWorkouts: [],
        completedMeals: [],
      },
    })

    const result = calculateWeeklyCalories(userData)
    // 6-month plan has more weeks than 4
    expect(result.length).toBeGreaterThan(4)
  })

  it('defaults to 3-month plan when no timeline specified', () => {
    const userData = createUserData({
      traineeGoals: {
        completedWorkouts: [],
        completedMeals: [],
      },
    })

    const result = calculateWeeklyCalories(userData)
    // 3-month plan: 12 weeks
    expect(result.length).toBeGreaterThan(4)
  })

  it('handles undefined traineeGoals gracefully', () => {
    const userData = createUserData({ traineeGoals: undefined })
    const result = calculateWeeklyCalories(userData)
    expect(result.length).toBeGreaterThan(0)
  })

  it('returns correct weekNumber for each entry', () => {
    const userData = createUserData()
    const result = calculateWeeklyCalories(userData)

    result.forEach((week, index) => {
      expect(week.weekNumber).toBe(index + 1)
    })
  })
})

describe('calculateDietaryProgress', () => {
  it('returns zeros when no meals completed', () => {
    const userData = createUserData()
    const result = calculateDietaryProgress(userData)

    expect(result.completedMealDays).toBe(0)
    expect(result.adherencePercentage).toBe(0)
    expect(result.avgDailyCalories).toBe(0)
    expect(result.totalMealDays).toBeGreaterThan(0)
  })

  it('calculates correct adherence percentage', () => {
    const userData = createUserData({
      traineeGoals: {
        targetTimeline: '1 month',
        completedWorkouts: [],
        completedMeals: ['1-1', '1-2', '1-3', '1-4', '1-5', '1-6', '1-7'], // All 7 days of week 1
      },
    })

    const result = calculateDietaryProgress(userData)

    // 1-month plan has 4 weeks × 7 days = 28 total meal days
    expect(result.completedMealDays).toBe(7)
    expect(result.totalMealDays).toBe(28)
    expect(result.adherencePercentage).toBe(25) // 7/28 = 25%
  })

  it('calculates correct average daily calories', () => {
    const userData = createUserData({
      traineeGoals: {
        targetTimeline: '1 month',
        completedWorkouts: [],
        completedMeals: ['1-1'], // Only day 1 of week 1
      },
    })

    const result = calculateDietaryProgress(userData)

    // Week 1, day 1 totalCalories = 2150
    expect(result.completedMealDays).toBe(1)
    expect(result.avgDailyCalories).toBe(2150)
  })

  it('handles user with no traineeGoals', () => {
    const userData = createUserData({ traineeGoals: undefined })
    const result = calculateDietaryProgress(userData)
    expect(result.totalMealDays).toBeGreaterThanOrEqual(0)
  })
})

describe('calculateWeeklyDietaryAdherence', () => {
  it('returns per-week adherence breakdown', () => {
    const userData = createUserData({
      traineeGoals: {
        targetTimeline: '1 month',
        completedWorkouts: [],
        completedMeals: ['1-1', '1-2', '1-3'], // 3 of 7 days in week 1
      },
    })

    const result = calculateWeeklyDietaryAdherence(userData)

    expect(result).toHaveLength(4) // 4 weeks
    expect(result[0].weekNumber).toBe(1)
    expect(result[0].completedDays).toBe(3)
    expect(result[0].totalDays).toBe(7)
    expect(result[0].adherencePercentage).toBe(43) // Math.round(3/7 * 100)
  })

  it('returns zeros for weeks with no completed meals', () => {
    const userData = createUserData()
    const result = calculateWeeklyDietaryAdherence(userData)

    for (const week of result) {
      expect(week.completedDays).toBe(0)
      expect(week.adherencePercentage).toBe(0)
    }
  })

  it('returns 100% adherence when all meals completed for a week', () => {
    const userData = createUserData({
      traineeGoals: {
        targetTimeline: '1 month',
        completedWorkouts: [],
        completedMeals: ['1-1', '1-2', '1-3', '1-4', '1-5', '1-6', '1-7'],
      },
    })

    const result = calculateWeeklyDietaryAdherence(userData)
    expect(result[0].adherencePercentage).toBe(100)
    expect(result[0].completedDays).toBe(7)
  })
})

describe('generateAnalyticsDataset', () => {
  it('returns complete TraineeAnalytics object', () => {
    const userData = createUserData({
      traineeGoals: {
        targetTimeline: '1 month',
        completedWorkouts: ['1-1'],
        completedMeals: ['1-1'],
      },
    })

    const result = generateAnalyticsDataset(userData)

    expect(result.userId).toBe('test-user')
    expect(result.userName).toBe('Test User')
    expect(result.email).toBe('test@example.com')
    expect(result.weeklyCalories).toBeDefined()
    expect(result.weeklyDietaryAdherence).toBeDefined()
    expect(result.totalCaloriesBurned).toBeGreaterThan(0)
    expect(result.totalWorkoutsCompleted).toBe(1)
    expect(result.progressPercentage).toBeGreaterThan(0)
    expect(result.currentWeek).toBe(1)
    expect(result.targetTimeline).toBe('1 month')
    expect(result.totalMealDaysCompleted).toBe(1)
    expect(result.totalMealDays).toBe(28)
    expect(result.dietaryAdherencePercentage).toBeGreaterThan(0)
    expect(result.avgDailyCalories).toBeGreaterThan(0)
  })

  it('handles user with no completed workouts', () => {
    const userData = createUserData()

    const result = generateAnalyticsDataset(userData)

    expect(result.totalCaloriesBurned).toBe(0)
    expect(result.totalWorkoutsCompleted).toBe(0)
    expect(result.progressPercentage).toBe(0)
    expect(result.currentWeek).toBe(1)
  })

  it('correctly determines currentWeek from latest completed workout', () => {
    const userData = createUserData({
      traineeGoals: {
        targetTimeline: '1 month',
        completedWorkouts: ['1-1', '3-1'], // Workouts in week 1 and week 3
        completedMeals: [],
      },
    })

    const result = generateAnalyticsDataset(userData)
    expect(result.currentWeek).toBe(3)
  })

  it('uses "Unknown" for missing displayName', () => {
    const userData = createUserData({ displayName: null })

    const result = generateAnalyticsDataset(userData)
    expect(result.userName).toBe('Unknown')
  })

  it('uses empty string for missing email', () => {
    const userData = createUserData({ email: null })

    const result = generateAnalyticsDataset(userData)
    expect(result.email).toBe('')
  })

  it('calculates correct progressPercentage', () => {
    // 1-month plan has 4 weeks × 7 days = 28 total workouts
    const userData = createUserData({
      traineeGoals: {
        targetTimeline: '1 month',
        completedWorkouts: ['1-1', '1-2', '1-3', '1-4', '1-5', '1-6', '1-7'], // 7 out of 28
        completedMeals: [],
      },
    })

    const result = generateAnalyticsDataset(userData)
    expect(result.progressPercentage).toBe(25) // 7/28 = 25%
  })
})

/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserData, WeeklyCalorieData, TraineeAnalytics } from '@/interface'
import { month1TraineeWorkoutPlan } from '@/constants/month1TraineeWorkoutPlan'
import { month3TraineeWorkoutPlan } from '@/constants/month3TraineeWorkoutPlan'
import { month6TraineeWorkoutPlan } from '@/constants/month6TraineeWorkoutPlan'

/**
 * Get the appropriate workout plan based on trainee's target timeline
 */
const getWorkoutPlan = (targetTimeline?: string) => {
  const timeline = targetTimeline?.toLowerCase().replace('_', ' ') || ''
  if (timeline.includes('1 month')) return month1TraineeWorkoutPlan
  if (timeline.includes('6 month') || timeline.includes('1 year')) return month6TraineeWorkoutPlan
  return month3TraineeWorkoutPlan // Default to 3 months
}

/**
 * Calculate weekly calorie burn for a trainee based on completed workouts
 */
export const calculateWeeklyCalories = (userData: UserData): WeeklyCalorieData[] => {
  const workoutPlan = getWorkoutPlan(userData.traineeGoals?.targetTimeline)
  const completedWorkouts = new Set(userData.traineeGoals?.completedWorkouts || [])

  return workoutPlan.workoutPlan.map(week => {
    let weekCalories = 0
    let weekCompleted = 0

    week.schedule.forEach(day => {
      const key = `${week.weekNumber}-${day.day}`
      if (completedWorkouts.has(key)) {
        weekCalories += day.caloriesBurned
        weekCompleted++
      }
    })

    return {
      weekNumber: week.weekNumber,
      caloriesBurned: weekCalories,
      workoutsCompleted: weekCompleted,
    }
  })
}

/**
 * Calculate dietary progress for a trainee based on completed meals
 */
export const calculateDietaryProgress = (userData: UserData) => {
  const workoutPlan = getWorkoutPlan(userData.traineeGoals?.targetTimeline)
  const completedMeals = new Set(userData.traineeGoals?.completedMeals || [])

  if (!workoutPlan.dietaryPlan) {
    return {
      totalMealDays: 0,
      completedMealDays: 0,
      adherencePercentage: 0,
      avgDailyCalories: 0,
    }
  }

  // Calculate total meal days
  const totalMealDays = workoutPlan.dietaryPlan.reduce(
    (acc: number, week: any) => acc + week.days.length,
    0
  )

  // Calculate completed meal days and average calories
  let totalCaloriesCompleted = 0
  let completedDayCount = 0

  workoutPlan.dietaryPlan.forEach((week: any) => {
    week.days.forEach((day: any) => {
      const key = `${week.weekNumber}-${day.day}`
      if (completedMeals.has(key)) {
        totalCaloriesCompleted += day.totalCalories
        completedDayCount++
      }
    })
  })

  const avgDailyCalories =
    completedDayCount > 0 ? Math.round(totalCaloriesCompleted / completedDayCount) : 0
  const adherencePercentage =
    totalMealDays > 0 ? Math.round((completedDayCount / totalMealDays) * 100) : 0

  return {
    totalMealDays,
    completedMealDays: completedDayCount,
    adherencePercentage,
    avgDailyCalories,
  }
}

/**
 * Generate complete analytics data for a trainee
 */
export const generateAnalyticsDataset = (userData: UserData): TraineeAnalytics => {
  const workoutPlan = getWorkoutPlan(userData.traineeGoals?.targetTimeline)
  const weeklyCalories = calculateWeeklyCalories(userData)

  // Calculate workout totals
  const totalCaloriesBurned = weeklyCalories.reduce((sum, week) => sum + week.caloriesBurned, 0)
  const totalWorkoutsCompleted = weeklyCalories.reduce(
    (sum, week) => sum + week.workoutsCompleted,
    0
  )

  // Calculate total workouts in plan
  const totalWorkoutsInPlan = workoutPlan.workoutPlan.reduce(
    (sum, week) => sum + week.schedule.length,
    0
  )

  // Calculate progress percentage
  const progressPercentage =
    totalWorkoutsInPlan > 0 ? Math.round((totalWorkoutsCompleted / totalWorkoutsInPlan) * 100) : 0

  // Determine current week (latest week with any completed workout, or 1 if none)
  let currentWeek = 1
  for (let i = weeklyCalories.length - 1; i >= 0; i--) {
    if (weeklyCalories[i].workoutsCompleted > 0) {
      currentWeek = weeklyCalories[i].weekNumber
      break
    }
  }

  // Calculate dietary progress
  const dietaryProgress = calculateDietaryProgress(userData)

  return {
    userId: userData.uid,
    userName: userData.displayName || 'Unknown',
    email: userData.email || '',
    weeklyCalories,
    totalCaloriesBurned,
    totalWorkoutsCompleted,
    progressPercentage,
    currentWeek,
    targetTimeline: userData.traineeGoals?.targetTimeline,
    // Dietary tracking
    totalMealDaysCompleted: dietaryProgress.completedMealDays,
    totalMealDays: dietaryProgress.totalMealDays,
    dietaryAdherencePercentage: dietaryProgress.adherencePercentage,
    avgDailyCalories: dietaryProgress.avgDailyCalories,
  }
}

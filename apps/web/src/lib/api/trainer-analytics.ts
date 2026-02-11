/* eslint-disable @typescript-eslint/no-explicit-any */
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
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
 * Fetch full trainee data including goals and completion status
 */
export const getTraineeAnalyticsData = async (userId: string): Promise<UserData | null> => {
  const userRef = doc(db, 'users', userId)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) return null

  const userData = userSnap.data()

  // Fetch trainee goals if they are a trainee
  let traineeData = null
  if (userData.role === 'trainee') {
    const goalsRef = doc(db, 'traineeGoals', userId)
    const goalsSnap = await getDoc(goalsRef)
    traineeData = goalsSnap.exists() ? goalsSnap.data() : null
  }

  return {
    ...userData,
    traineeGoals: traineeData,
  } as UserData & { traineeGoals: any }
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
 * Generate complete analytics data for a trainee
 */
export const generateAnalyticsDataset = (userData: UserData): TraineeAnalytics => {
  const workoutPlan = getWorkoutPlan(userData.traineeGoals?.targetTimeline)
  const weeklyCalories = calculateWeeklyCalories(userData)

  // Calculate totals
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
  }
}

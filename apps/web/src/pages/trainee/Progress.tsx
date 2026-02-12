/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCurrentUser } from '@/hooks/useUser'
import { month1TraineeWorkoutPlan } from '@/constants/month1TraineeWorkoutPlan'
import { month3TraineeWorkoutPlan } from '@/constants/month3TraineeWorkoutPlan'
import { month6TraineeWorkoutPlan } from '@/constants/month6TraineeWorkoutPlan'
import { useState } from 'react'
import { getAchievements } from '@/constants'

// Section Components
import Header from '@/sections/trainee/progress/Header'
import WeeklyActivity from '@/sections/trainee/progress/WeeklyActivity'
import BodyMeasurements from '@/sections/trainee/progress/BodyMeasurements'
import TopStatsGrid from '@/sections/trainee/progress/TopStatsGrid'
import Achievements from '@/sections/trainee/progress/Achievements'
import DietaryStatsCard from '@/sections/trainee/progress/DietaryStatsCard'
import WeeklyDietaryActivity from '@/sections/trainee/progress/WeeklyDietaryActivity'

const ITEMS_PER_PAGE = 5

const ProgressPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [dietaryPage, setDietaryPage] = useState(1)

  const { data: userData, isLoading } = useCurrentUser()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Helper to get the correct workout plan
  const getWorkoutPlan = () => {
    const timeline = userData?.traineeGoals?.targetTimeline?.toLowerCase().replace('_', ' ') || ''
    if (timeline.includes('1 month')) return month1TraineeWorkoutPlan
    if (timeline.includes('6 month') || timeline.includes('1 year')) return month6TraineeWorkoutPlan
    return month3TraineeWorkoutPlan // Default
  }

  const currentWorkoutPlan = getWorkoutPlan()
  const completedWorkouts = new Set(userData?.traineeGoals?.completedWorkouts || [])

  // Calculate Aggregated Stats
  let totalWorkouts = 0
  let totalBurned = 0
  const totalCompleted = completedWorkouts.size

  // Weekly Progress Data
  const weeklyProgress = currentWorkoutPlan.workoutPlan.map(week => {
    const weekWorkouts = week.schedule
    const weekTotal = weekWorkouts.length
    let weekCompleted = 0

    weekWorkouts.forEach(day => {
      const key = `${week.weekNumber}-${day.day}`
      if (completedWorkouts.has(key)) {
        weekCompleted++
        totalBurned += day.caloriesBurned
      }
    })

    totalWorkouts += weekTotal

    return {
      week: `Week ${week.weekNumber}`,
      weekNumber: week.weekNumber,
      total: weekTotal,
      completed: weekCompleted,
      percentage: Math.round((weekCompleted / weekTotal) * 100),
    }
  })

  const completionPercentage =
    totalWorkouts > 0 ? Math.round((totalCompleted / totalWorkouts) * 100) : 0

  // Dietary Progress Calculations
  const completedMeals = new Set(userData?.traineeGoals?.completedMeals || [])
  const totalMealDays =
    currentWorkoutPlan.dietaryPlan?.reduce((acc: number, week: any) => acc + week.days.length, 0) ||
    0

  // Calculate dietary stats
  let totalCaloriesCompleted = 0
  let completedMealDayCount = 0

  currentWorkoutPlan.dietaryPlan?.forEach((week: any) => {
    week.days.forEach((day: any) => {
      const key = `${week.weekNumber}-${day.day}`
      if (completedMeals.has(key)) {
        totalCaloriesCompleted += day.totalCalories
        completedMealDayCount++
      }
    })
  })

  const avgDailyCalories =
    completedMealDayCount > 0 ? Math.round(totalCaloriesCompleted / completedMealDayCount) : 0
  const dietaryAdherencePercentage =
    totalMealDays > 0 ? Math.round((completedMealDayCount / totalMealDays) * 100) : 0

  // Calculate current dietary streak
  let currentDietaryStreak = 0
  if (currentWorkoutPlan.dietaryPlan) {
    for (const week of currentWorkoutPlan.dietaryPlan) {
      const allDaysCompleted = week.days.every((day: any) =>
        completedMeals.has(`${week.weekNumber}-${day.day}`)
      )
      if (allDaysCompleted) {
        currentDietaryStreak++
      } else {
        break
      }
    }
  }

  // Weekly Dietary Progress Data
  const weeklyDietaryProgress =
    currentWorkoutPlan.dietaryPlan?.map((week: any) => {
      const weekMealDays = week.days
      const weekTotal = weekMealDays.length
      let weekCompleted = 0

      weekMealDays.forEach((day: any) => {
        const key = `${week.weekNumber}-${day.day}`
        if (completedMeals.has(key)) {
          weekCompleted++
        }
      })

      return {
        week: `Week ${week.weekNumber}`,
        weekNumber: week.weekNumber,
        total: weekTotal,
        completed: weekCompleted,
        percentage: Math.round((weekCompleted / weekTotal) * 100),
      }
    }) || []

  // Pagination Logic
  const totalPages = Math.ceil(weeklyProgress.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentWeeks = weeklyProgress.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  // Dietary pagination
  const dietaryTotalPages = Math.ceil(weeklyDietaryProgress.length / ITEMS_PER_PAGE)
  const dietaryStartIndex = (dietaryPage - 1) * ITEMS_PER_PAGE
  const currentDietaryWeeks = weeklyDietaryProgress.slice(
    dietaryStartIndex,
    dietaryStartIndex + ITEMS_PER_PAGE
  )

  const handleDietaryPrevPage = () => {
    setDietaryPage(prev => Math.max(prev - 1, 1))
  }

  const handleDietaryNextPage = () => {
    setDietaryPage(prev => Math.min(prev + 1, dietaryTotalPages))
  }

  return (
    <div className="container mx-auto p-4 space-y-8 max-w-7xl animate-in fade-in duration-500">
      <Header />

      <TopStatsGrid
        completionPercentage={completionPercentage}
        totalCompleted={totalCompleted}
        totalBurned={totalBurned}
        targetTimeline={userData?.traineeGoals?.targetTimeline}
      />

      {/* Dietary Progress Section */}
      <DietaryStatsCard
        totalMealDays={totalMealDays}
        completedMealDays={completedMealDayCount}
        adherencePercentage={dietaryAdherencePercentage}
        avgDailyCalories={avgDailyCalories}
        currentStreak={currentDietaryStreak}
      />

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-4">
        {/* Left Column: Weekly Activity */}
        <div className="lg:col-span-2 space-y-8">
          <WeeklyActivity
            weeklyProgress={weeklyProgress}
            currentPage={currentPage}
            totalPages={totalPages}
            currentWeeks={currentWeeks}
            startIndex={startIndex}
            totalCompleted={totalCompleted}
            handlePrevPage={handlePrevPage}
            handleNextPage={handleNextPage}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </div>

        {/* Right Column: Dietary Activity */}
        <div className="lg:col-span-2 space-y-8">
          <WeeklyDietaryActivity
            weeklyProgress={weeklyDietaryProgress}
            currentPage={dietaryPage}
            totalPages={dietaryTotalPages}
            currentWeeks={currentDietaryWeeks}
            startIndex={dietaryStartIndex}
            totalCompleted={completedMealDayCount}
            handlePrevPage={handleDietaryPrevPage}
            handleNextPage={handleDietaryNextPage}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Achievements achievements={getAchievements(totalCompleted)} />
        </div>

        <div className="lg:col-span-1">
          <BodyMeasurements />
        </div>
      </div>
    </div>
  )
}

export default ProgressPage

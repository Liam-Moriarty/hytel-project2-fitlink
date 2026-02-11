import { getFullUser } from '@/lib/api/user'
import { getAuth } from 'firebase/auth'
import { useQuery } from '@tanstack/react-query'
import { month1TraineeWorkoutPlan } from '@/constants/month1TraineeWorkoutPlan'
import { month3TraineeWorkoutPlan } from '@/constants/month3TraineeWorkoutPlan'
import { month6TraineeWorkoutPlan } from '@/constants/month6TraineeWorkoutPlan'
import { useState } from 'react'
import { UserData } from '@/interface'
import { getAchievements } from '@/constants'

// Section Components
import Header from '@/sections/trainee/progress/Header'
import WeeklyActivity from '@/sections/trainee/progress/WeeklyActivity'
import BodyMeasurements from '@/sections/trainee/progress/BodyMeasurements'
import TopStatsGrid from '@/sections/trainee/progress/TopStatsGrid'
import Achievements from '@/sections/trainee/progress/Achievements'

const ITEMS_PER_PAGE = 5

const ProgressPage = () => {
  const auth = getAuth()
  const currentUser = auth.currentUser
  const [currentPage, setCurrentPage] = useState(1)

  const { data: userData, isLoading } = useQuery<UserData | null>({
    queryKey: ['user', currentUser?.uid],
    queryFn: () => (currentUser ? getFullUser(currentUser.uid) : null),
    enabled: !!currentUser,
  })

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

  return (
    <div className="container mx-auto p-4 space-y-8 max-w-7xl animate-in fade-in duration-500">
      <Header />

      <TopStatsGrid
        completionPercentage={completionPercentage}
        totalCompleted={totalCompleted}
        totalBurned={totalBurned}
        targetTimeline={userData?.traineeGoals?.targetTimeline}
      />

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
        {/* Left Column: Weekly Activity & Body Measurements */}
        <div className="lg:col-span-1 space-y-8">
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

          <BodyMeasurements />
        </div>

        {/* Right Column: Achievements */}
        <div className="lg:col-span-2">
          <Achievements achievements={getAchievements(totalCompleted)} />
        </div>
      </div>
    </div>
  )
}

export default ProgressPage

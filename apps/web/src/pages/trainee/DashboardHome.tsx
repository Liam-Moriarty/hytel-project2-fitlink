import { getFullUser } from '@/lib/api/user'
import { getAuth } from 'firebase/auth'
import { useQuery } from '@tanstack/react-query'
import { month1TraineeWorkoutPlan } from '@/constants/month1TraineeWorkoutPlan'
import { month3TraineeWorkoutPlan } from '@/constants/month3TraineeWorkoutPlan'
import { month6TraineeWorkoutPlan } from '@/constants/month6TraineeWorkoutPlan'
import { UserData } from '@/interface'
import { getAchievements } from '@/constants'
import { useNavigate } from 'react-router-dom'

// Section Components
import Header from '@/sections/trainee/dashboard/Header'
import TraineeTopStatsGrid from '@/sections/trainee/dashboard/TraineeTopStatsGrid'
import TodayWorkout from '@/sections/trainee/dashboard/TodayWorkout'
import WeekProgress from '@/sections/trainee/dashboard/WeekProgress'
import GoalsOverview from '@/sections/trainee/dashboard/GoalsOverview'
import Achievements from '@/sections/trainee/dashboard/TraineeAchievements'
import MotivationCard from '@/sections/trainee/dashboard/MotivationCard'

const DashboardHome = () => {
  const auth = getAuth()
  const currentUser = auth.currentUser
  const navigate = useNavigate()

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
    return month3TraineeWorkoutPlan
  }

  const currentWorkoutPlan = getWorkoutPlan()
  const completedWorkouts = new Set(userData?.traineeGoals?.completedWorkouts || [])

  // Calculate Stats
  let totalWorkouts = 0
  let totalBurned = 0
  const totalCompleted = completedWorkouts.size

  currentWorkoutPlan.workoutPlan.forEach(week => {
    totalWorkouts += week.schedule.length
    week.schedule.forEach(day => {
      const key = `${week.weekNumber}-${day.day}`
      if (completedWorkouts.has(key)) {
        totalBurned += day.caloriesBurned
      }
    })
  })

  const completionPercentage =
    totalWorkouts > 0 ? Math.round((totalCompleted / totalWorkouts) * 100) : 0

  // Get current week progress
  const getCurrentWeekProgress = () => {
    const currentWeek = currentWorkoutPlan.workoutPlan[0]
    if (!currentWeek) return { weekNumber: 1, completed: 0, total: 0, percentage: 0 }

    const weekWorkouts = currentWeek.schedule
    const weekTotal = weekWorkouts.length
    let weekCompleted = 0

    weekWorkouts.forEach(day => {
      const key = `${currentWeek.weekNumber}-${day.day}`
      if (completedWorkouts.has(key)) {
        weekCompleted++
      }
    })

    return {
      weekNumber: currentWeek.weekNumber,
      completed: weekCompleted,
      total: weekTotal,
      percentage: Math.round((weekCompleted / weekTotal) * 100),
    }
  }

  const currentWeekProgress = getCurrentWeekProgress()

  // Get today's workout
  const getTodayWorkout = () => {
    const currentWeek = currentWorkoutPlan.workoutPlan[0]
    if (!currentWeek) return null

    // Find first incomplete workout
    for (const day of currentWeek.schedule) {
      const key = `${currentWeek.weekNumber}-${day.day}`
      if (!completedWorkouts.has(key)) {
        return { ...day, weekNumber: currentWeek.weekNumber, key }
      }
    }
    return null
  }

  const todayWorkout = getTodayWorkout()

  // Get achievements
  const achievements = getAchievements(totalCompleted)
  const activeAchievements = achievements.filter(a => a.active)

  return (
    <div className="container mx-auto p-4 space-y-8 max-w-7xl">
      <Header userData={userData ?? null} />

      <TraineeTopStatsGrid
        completionPercentage={completionPercentage}
        totalCompleted={totalCompleted}
        totalWorkouts={totalWorkouts}
        totalBurned={totalBurned}
      />

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
        {/* Left Column: Today's Workout & Current Week */}
        <div className="lg:col-span-2 space-y-6">
          <TodayWorkout todayWorkout={todayWorkout} navigate={navigate} />
          <WeekProgress currentWeekProgress={currentWeekProgress} navigate={navigate} />
          <GoalsOverview userData={userData ?? null} />
        </div>

        {/* Right Column: Achievements & Quick Stats */}
        <div className="space-y-6">
          <Achievements
            achievements={achievements}
            activeAchievements={activeAchievements}
            navigate={navigate}
          />
          <MotivationCard
            totalCompleted={totalCompleted}
            totalBurned={totalBurned}
            completionPercentage={completionPercentage}
          />
        </div>
      </div>
    </div>
  )
}

export default DashboardHome

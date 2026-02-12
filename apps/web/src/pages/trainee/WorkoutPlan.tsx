import { useCurrentUser, useUpdateTraineeGoals } from '@/hooks/useUser'
import { getAuth } from 'firebase/auth'
import { month1TraineeWorkoutPlan } from '@/constants/month1TraineeWorkoutPlan'
import { month3TraineeWorkoutPlan } from '@/constants/month3TraineeWorkoutPlan'
import { month6TraineeWorkoutPlan } from '@/constants/month6TraineeWorkoutPlan'
import { useState, useEffect } from 'react'

// Section Components
import Header from '@/sections/trainee/workout-plan/Header'
import GoalsCard from '@/sections/trainee/workout-plan/GoalsCard'
import WorkoutTabs from '@/sections/trainee/workout-plan/WorkoutTabs'
import DietaryPlan from '@/sections/trainee/workout-plan/DietaryPlan'
import Footer from '@/sections/trainee/workout-plan/Footer'

const WorkoutPlan = () => {
  const auth = getAuth()
  const currentUser = auth.currentUser

  const { data: userData, isLoading } = useCurrentUser()

  const { mutate: updateGoals } = useUpdateTraineeGoals(currentUser?.uid ?? '')
  const [completedWorkouts, setCompletedWorkouts] = useState<Set<string>>(new Set())

  // Sync state with user data when loaded
  useEffect(() => {
    if (userData?.traineeGoals?.completedWorkouts) {
      setCompletedWorkouts(new Set(userData.traineeGoals.completedWorkouts))
    }
  }, [userData])

  const toggleWorkoutCompletion = (weekNum: number, dayNum: number) => {
    if (!currentUser) return // Guard clause

    const key = `${weekNum}-${dayNum}`
    const newSet = new Set(completedWorkouts)

    if (newSet.has(key)) {
      newSet.delete(key)
    } else {
      newSet.add(key)
    }

    setCompletedWorkouts(newSet) // Optimistic update
    updateGoals({ completedWorkouts: Array.from(newSet) })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Select workout plan based on user's target timeline
  const getWorkoutPlan = () => {
    const timeline = userData?.traineeGoals?.targetTimeline?.toLowerCase().replace('_', ' ') || ''

    if (timeline.includes('1 month')) return month1TraineeWorkoutPlan
    if (timeline.includes('6 month') || timeline.includes('1 year')) return month6TraineeWorkoutPlan
    return month3TraineeWorkoutPlan // Default to 3 months
  }

  const currentWorkoutPlan = getWorkoutPlan()

  // Calculate progress
  const totalWorkouts = currentWorkoutPlan.workoutPlan.reduce(
    (acc, week) => acc + week.schedule.length,
    0
  )
  const completedCount = completedWorkouts.size
  const progressPercentage = Math.round((completedCount / totalWorkouts) * 100)

  return (
    <div className="container mx-auto p-4 space-y-8 max-w-7xl">
      <Header
        userData={userData ?? null}
        progressPercentage={progressPercentage}
        completedCount={completedCount}
        totalWorkouts={totalWorkouts}
      />

      <GoalsCard userData={userData ?? null} />

      <WorkoutTabs
        workoutPlan={currentWorkoutPlan}
        completedWorkouts={completedWorkouts}
        toggleWorkoutCompletion={toggleWorkoutCompletion}
      />

      <DietaryPlan workoutPlan={currentWorkoutPlan} />

      <Footer userData={userData ?? null} />
    </div>
  )
}

export default WorkoutPlan

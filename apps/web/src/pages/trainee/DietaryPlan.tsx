import { useCurrentUser, useUpdateTraineeGoals } from '@/hooks/useUser'
import { getAuth } from 'firebase/auth'
import { month1TraineeWorkoutPlan } from '@/constants/month1TraineeWorkoutPlan'
import { month3TraineeWorkoutPlan } from '@/constants/month3TraineeWorkoutPlan'
import { month6TraineeWorkoutPlan } from '@/constants/month6TraineeWorkoutPlan'
import { useState, useEffect } from 'react'

// Section Components
import Header from '@/sections/trainee/dietary-plan/Header'
import GoalsCard from '@/sections/trainee/dietary-plan/GoalsCard'
import MealPlanTabs from '@/sections/trainee/dietary-plan/MealPlanTabs'
import InsightsCard from '@/sections/trainee/dietary-plan/InsightsCard'
import Footer from '@/sections/trainee/dietary-plan/Footer'

const DietaryPlan = () => {
  const auth = getAuth()
  const currentUser = auth.currentUser

  const { data: userData, isLoading } = useCurrentUser()

  const { mutate: updateGoals } = useUpdateTraineeGoals(currentUser?.uid ?? '')
  const [completedMeals, setCompletedMeals] = useState<Set<string>>(new Set())

  // Sync state with user data when loaded
  useEffect(() => {
    if (userData?.traineeGoals?.completedMeals) {
      setCompletedMeals(new Set(userData.traineeGoals.completedMeals))
    }
  }, [userData])

  const toggleMealCompletion = (weekNum: number, dayNum: number) => {
    if (!currentUser) return // Guard clause

    const key = `${weekNum}-${dayNum}`
    const newSet = new Set(completedMeals)

    if (newSet.has(key)) {
      newSet.delete(key)
    } else {
      newSet.add(key)
    }

    setCompletedMeals(newSet) // Optimistic update
    updateGoals({ completedMeals: Array.from(newSet) })
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

  // Calculate progress for dietary plan
  const totalMealDays =
    currentWorkoutPlan.dietaryPlan?.reduce((acc, week) => acc + week.days.length, 0) || 0
  const completedCount = completedMeals.size
  const progressPercentage =
    totalMealDays > 0 ? Math.round((completedCount / totalMealDays) * 100) : 0

  // Get dietary plan metadata
  const dailyIntakeGoal = currentWorkoutPlan.dietaryPlan?.[0]?.dailyIntakeGoal || 2200
  const totalWeeks = currentWorkoutPlan.dietaryPlan?.length || 0

  return (
    <div className="container mx-auto p-4 space-y-8 max-w-7xl">
      <Header
        userData={userData ?? null}
        progressPercentage={progressPercentage}
        completedCount={completedCount}
        totalMealDays={totalMealDays}
      />

      <GoalsCard
        userData={userData ?? null}
        dailyIntakeGoal={dailyIntakeGoal}
        totalWeeks={totalWeeks}
      />

      <InsightsCard completedMeals={completedMeals} workoutPlan={currentWorkoutPlan} />

      <MealPlanTabs
        workoutPlan={currentWorkoutPlan}
        completedMeals={completedMeals}
        toggleMealCompletion={toggleMealCompletion}
      />

      <Footer userData={userData ?? null} />
    </div>
  )
}

export default DietaryPlan

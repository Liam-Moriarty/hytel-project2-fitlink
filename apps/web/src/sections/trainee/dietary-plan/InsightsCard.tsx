/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Flame, Target, TrendingUp } from 'lucide-react'
import { DietaryInsightsCardProps } from '@/interface'

const InsightsCard = ({ completedMeals, workoutPlan }: DietaryInsightsCardProps) => {
  if (!workoutPlan.dietaryPlan) return null

  const dietaryPlan = workoutPlan.dietaryPlan

  // 1. Overall adherence percentage
  const totalMealDays = dietaryPlan.reduce((acc: number, week: any) => acc + week.days.length, 0)
  const adherencePercentage =
    totalMealDays > 0 ? Math.round((completedMeals.size / totalMealDays) * 100) : 0

  // 2. Average daily calories for completed days vs goal
  let totalCaloriesCompleted = 0
  let totalGoalForCompleted = 0
  let completedDayCount = 0

  dietaryPlan.forEach((week: any) => {
    week.days.forEach((day: any) => {
      const key = `${week.weekNumber}-${day.day}`
      if (completedMeals.has(key)) {
        totalCaloriesCompleted += day.totalCalories
        totalGoalForCompleted += week.dailyIntakeGoal
        completedDayCount++
      }
    })
  })

  const avgDailyCalories =
    completedDayCount > 0 ? Math.round(totalCaloriesCompleted / completedDayCount) : 0
  const avgDailyGoal =
    completedDayCount > 0
      ? Math.round(totalGoalForCompleted / completedDayCount)
      : dietaryPlan[0]?.dailyIntakeGoal || 2200

  // 3. Current week streak (consecutive completed weeks from the start)
  let currentStreak = 0
  for (const week of dietaryPlan) {
    const allDaysCompleted = week.days.every((day: any) =>
      completedMeals.has(`${week.weekNumber}-${day.day}`)
    )
    if (allDaysCompleted) {
      currentStreak++
    } else {
      break
    }
  }

  // 4. Best week performance (week with highest completion %)
  let bestWeekNumber = 0
  let bestWeekPercentage = 0

  dietaryPlan.forEach((week: any) => {
    const weekCompleted = week.days.filter((day: any) =>
      completedMeals.has(`${week.weekNumber}-${day.day}`)
    ).length
    const weekPercentage = Math.round((weekCompleted / week.days.length) * 100)

    if (weekPercentage > bestWeekPercentage) {
      bestWeekPercentage = weekPercentage
      bestWeekNumber = week.weekNumber
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Dietary Insights</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Adherence Card */}
        <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardDescription className="text-green-100 flex items-center gap-2">
              <Target className="h-4 w-4" /> Adherence
            </CardDescription>
            <CardTitle className="text-4xl font-bold">{adherencePercentage}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-100">
              {completedMeals.size} of {totalMealDays} days tracked
            </p>
          </CardContent>
        </Card>

        {/* Average Calories Card */}
        <Card className="bg-gradient-to-br from-orange-500 to-amber-600 text-white border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardDescription className="text-orange-100 flex items-center gap-2">
              <Flame className="h-4 w-4" /> Avg. Daily Calories
            </CardDescription>
            <CardTitle className="text-4xl font-bold">{avgDailyCalories}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-100">Goal: {avgDailyGoal} cal/day</p>
            <p className="text-xs text-orange-200 mt-1">
              {avgDailyCalories > avgDailyGoal
                ? `+${avgDailyCalories - avgDailyGoal} over target`
                : avgDailyCalories < avgDailyGoal
                  ? `${avgDailyGoal - avgDailyCalories} under target`
                  : 'Right on target!'}
            </p>
          </CardContent>
        </Card>

        {/* Week Streak Card */}
        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardDescription className="text-blue-100 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Week Streak
            </CardDescription>
            <CardTitle className="text-4xl font-bold">{currentStreak}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-100">
              {currentStreak === 1 ? 'consecutive week' : 'consecutive weeks'}
            </p>
          </CardContent>
        </Card>

        {/* Best Week Card */}
        <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardDescription className="text-purple-100 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> Best Week
            </CardDescription>
            <CardTitle className="text-4xl font-bold">
              {bestWeekNumber > 0 ? `Week ${bestWeekNumber}` : 'N/A'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-purple-100">{bestWeekPercentage}% compliance</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default InsightsCard

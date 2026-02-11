import { getFullUser } from '@/lib/api/user'
import { getAuth } from 'firebase/auth'
import { useQuery } from '@tanstack/react-query'
import { month1TraineeWorkoutPlan } from '@/constants/month1TraineeWorkoutPlan'
import { month3TraineeWorkoutPlan } from '@/constants/month3TraineeWorkoutPlan'
import { month6TraineeWorkoutPlan } from '@/constants/month6TraineeWorkoutPlan'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Activity,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Dumbbell,
  Flame,
  Target,
  TrendingUp,
  Trophy,
  ArrowRight,
} from 'lucide-react'
import { UserData } from '@/interface'
import { getAchievements } from '@/constants'
import { useNavigate } from 'react-router-dom'

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
      {/* Header Section */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {userData?.displayName || 'Trainee'}! 👋
        </h1>
        <p className="text-muted-foreground">Here's your fitness summary</p>
      </div>

      {/* Top Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Overall Progress */}
        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-none shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="text-blue-100 flex items-center gap-2">
              <Target className="h-4 w-4" /> Overall Progress
            </CardDescription>
            <CardTitle className="text-4xl font-bold">{completionPercentage}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-100">
              {totalCompleted} of {totalWorkouts} workouts
            </p>
            <Progress value={completionPercentage} className="h-2 mt-2 bg-blue-200" />
          </CardContent>
        </Card>

        {/* Total Workouts */}
        <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white border-none shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="text-green-100 flex items-center gap-2">
              <Dumbbell className="h-4 w-4" /> Workouts Completed
            </CardDescription>
            <CardTitle className="text-4xl font-bold">{totalCompleted}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-100">sessions finished</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Keep it up!</span>
            </div>
          </CardContent>
        </Card>

        {/* Calories Burned */}
        <Card className="bg-gradient-to-br from-amber-400 to-orange-500 text-white border-none shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="text-amber-100 flex items-center gap-2">
              <Flame className="h-4 w-4" /> Calories Burned
            </CardDescription>
            <CardTitle className="text-4xl font-bold">
              {totalBurned >= 1000 ? `${(totalBurned / 1000).toFixed(1)}k` : totalBurned}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-100">total calories</p>
            <div className="flex items-center gap-1 mt-2">
              <Activity className="h-4 w-4" />
              <span className="text-sm">
                Avg: {Math.round(totalBurned / (totalCompleted || 1))} cal/workout
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Current Streak */}
        <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-none shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="text-orange-100 flex items-center gap-2">
              <Flame className="h-4 w-4" /> Current Streak
            </CardDescription>
            <CardTitle className="text-4xl font-bold">5</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-100">days in a row</p>
            <div className="flex items-center gap-1 mt-2">
              <Trophy className="h-4 w-4" />
              <span className="text-sm">On fire! 🔥</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
        {/* Left Column: Today's Workout & Current Week */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Workout */}
          {todayWorkout ? (
            <Card className="shadow-lg border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Today's Workout
                  </CardTitle>
                  <Badge variant="default">Week {todayWorkout.weekNumber}</Badge>
                </div>
                <CardDescription>Your next scheduled session</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{todayWorkout.workoutType}</h3>
                    <p className="text-muted-foreground">{todayWorkout.description}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-semibold">{todayWorkout.durationMinutes} min</p>
                        <p className="text-xs text-muted-foreground">Duration</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <div>
                        <p className="font-semibold">{todayWorkout.caloriesBurned} cal</p>
                        <p className="text-xs text-muted-foreground">Est. Burn</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Activity className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="font-semibold capitalize">{todayWorkout.intensity}</p>
                        <p className="text-xs text-muted-foreground">Intensity</p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full" size="lg" onClick={() => navigate('workout-plan')}>
                    Start Workout
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  All Caught Up!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  You've completed all workouts in the current week. Great job! 🎉
                </p>
                <Button className="mt-4" onClick={() => navigate('workout-plan')}>
                  View Workout Plan
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Current Week Progress */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                This Week's Progress
              </CardTitle>
              <CardDescription>Week {currentWeekProgress.weekNumber}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="font-medium">
                  {currentWeekProgress.completed} of {currentWeekProgress.total} workouts completed
                </span>
                <span className="text-muted-foreground">{currentWeekProgress.percentage}%</span>
              </div>
              <Progress value={currentWeekProgress.percentage} className="h-3" />

              <div className="flex justify-between items-center pt-2">
                <Button variant="outline" size="sm" onClick={() => navigate('workout-plan')}>
                  View Full Plan
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigate('progress')}>
                  View Progress
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Goals Overview */}
          {userData?.traineeGoals && (
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Your Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Main Goal</p>
                  <p className="font-semibold">
                    {userData.traineeGoals.goals[0] || 'General Fitness'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Target Timeline</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-primary capitalize">
                      {userData.traineeGoals.targetTimeline}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Weekly Frequency</p>
                  <p className="font-semibold">
                    {userData.traineeGoals.frequencyPerWeek} Days/Week
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Activity Level</p>
                  <p className="font-semibold capitalize">{userData.activityLevel || 'Standard'}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Achievements & Quick Stats */}
        <div className="space-y-6">
          {/* Achievements */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                Recent Achievements
              </CardTitle>
              <CardDescription>
                {activeAchievements.length} of {achievements.length} unlocked
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {activeAchievements.slice(0, 3).map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg bg-background border`}
                >
                  <div className="p-2 rounded-full bg-white shadow-sm">
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}

              {activeAchievements.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Complete workouts to unlock achievements!</p>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full mt-2"
                size="sm"
                onClick={() => navigate('progress')}
              >
                View All Achievements
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Quick Reminder */}
          <Card className="shadow-md bg-background border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-purple-600" />
                Keep Going!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Consistency is key to reaching your fitness goals. You're doing great!
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>{totalCompleted} workouts completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>{totalBurned} calories burned</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>{completionPercentage}% program complete</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DashboardHome

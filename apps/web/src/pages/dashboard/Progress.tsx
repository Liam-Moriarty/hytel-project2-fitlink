import { getFullUser } from '@/lib/api/user'
import { getAuth } from 'firebase/auth'
import { useQuery } from '@tanstack/react-query'
import { month1TraineeWorkoutPlan } from '@/constants/month1TraineeWorkoutPlan'
import { month3TraineeWorkoutPlan } from '@/constants/month3TraineeWorkoutPlan'
import { month6TraineeWorkoutPlan } from '@/constants/month6TraineeWorkoutPlan'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Activity,
  Award,
  Calendar,
  Dumbbell,
  Flame,
  Target,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { UserData } from '@/interface'
import { getAchievements } from '@/constants'

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
      <div className="flex items-center justify-center h-full">
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

  // Ensure totalWorkouts is calculated from the plan, which is done above in the map
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
      {/* Header Section */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Your Progress</h1>
        <p className="text-muted-foreground">Track your fitness journey and achievements</p>
      </div>

      {/* Top Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Streak (Static for now) */}
        <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardDescription className="text-orange-100 flex items-center gap-2">
              <Flame className="h-4 w-4" /> Current Streak
            </CardDescription>
            <CardTitle className="text-4xl font-bold">5</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-100">days in a row</p>
          </CardContent>
        </Card>

        {/* Completion % */}
        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardDescription className="text-blue-100 flex items-center gap-2">
              <Target className="h-4 w-4" /> Completion
            </CardDescription>
            <CardTitle className="text-4xl font-bold">{completionPercentage}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-100">
              of {userData?.traineeGoals?.targetTimeline || 'program'}
            </p>
          </CardContent>
        </Card>

        {/* Total Workouts */}
        <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardDescription className="text-green-100 flex items-center gap-2">
              <Dumbbell className="h-4 w-4" /> Total Workouts
            </CardDescription>
            <CardTitle className="text-4xl font-bold">{totalCompleted}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-100">completed</p>
          </CardContent>
        </Card>

        {/* Calories Burned */}
        <Card className="bg-gradient-to-br from-amber-400 to-orange-500 text-white border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardDescription className="text-amber-100 flex items-center gap-2">
              <Activity className="h-4 w-4" /> Calories Burned
            </CardDescription>
            <CardTitle className="text-4xl font-bold">
              {totalBurned >= 1000 ? `${(totalBurned / 1000).toFixed(1)}k` : totalBurned}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-100">total calories</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
        {/* Left Column: Weekly Activity & Body Measurements */}
        <div className="lg:col-span-1 space-y-8">
          {/* Weekly Activity */}
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" /> Weekly Activity
                </CardTitle>
                <div className="text-xs text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentWeeks.map(week => (
                <div
                  key={week.weekNumber}
                  className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-300"
                >
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-muted-foreground">{week.week}</span>
                    <span className="text-muted-foreground">{week.completed} workouts</span>
                  </div>
                  <Progress value={week.percentage} className="h-2" />
                </div>
              ))}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center pt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    Showing {startIndex + 1}-
                    {Math.min(startIndex + ITEMS_PER_PAGE, weeklyProgress.length)} of{' '}
                    {weeklyProgress.length}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-muted-foreground">Average per week</div>
                <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                  {(totalCompleted / (weeklyProgress.length || 1)).toFixed(1)} workouts
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Body Measurements (Static) */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" /> Body Measurements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { date: 'Jan 1', weight: '75 kg', fat: '20%' },
                  { date: 'Jan 15', weight: '74 kg', fat: '19.5%' },
                  { date: 'Feb 1', weight: '73.5 kg', fat: '19%' },
                ].map((entry, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center pb-4 border-b last:border-0 last:pb-0"
                  >
                    <span className="font-medium text-muted-foreground">{entry.date}</span>
                    <div className="text-right">
                      <div className="font-bold">{entry.weight}</div>
                      <div className="text-xs text-muted-foreground">Weight</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{entry.fat}</div>
                      <div className="text-xs text-muted-foreground">Body Fat</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Achievements */}
        <div className="lg:col-span-2">
          <Card className="h-full shadow-md border-none bg-transparent">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Award className="h-5 w-5 text-amber-500" /> Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {getAchievements(totalCompleted).map((item, i) => (
                  <div
                    key={i}
                    className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-all hover:shadow-lg ${item.active ? item.bg + ' border-' + item.color.split('-')[1] + '-200' : 'bg-gray-50 border-gray-100 opacity-70'}`}
                  >
                    <div
                      className={`p-3 rounded-full mb-3 ${item.active ? 'bg-white shadow-sm' : 'bg-gray-200'}`}
                    >
                      <item.icon
                        className={`h-8 w-8 ${item.active ? item.color : 'text-gray-400'}`}
                      />
                    </div>
                    <h3 className={`font-bold ${item.active ? 'text-gray-900' : 'text-gray-500'}`}>
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground text-center mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ProgressPage

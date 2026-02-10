import { getFullUser, updateTraineeGoals } from '@/lib/api/user'
import { getAuth } from 'firebase/auth'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { month1TraineeWorkoutPlan } from '@/constants/month1TraineeWorkoutPlan'
import { month3TraineeWorkoutPlan } from '@/constants/month3TraineeWorkoutPlan'
import { month6TraineeWorkoutPlan } from '@/constants/month6TraineeWorkoutPlan'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  Calendar,
  Target,
  Activity,
  Trophy,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { UserData } from '@/interface'

const WorkoutPlan = () => {
  const auth = getAuth()
  const currentUser = auth.currentUser

  const { data: userData, isLoading } = useQuery<UserData | null>({
    queryKey: ['user', currentUser?.uid],
    queryFn: () => (currentUser ? getFullUser(currentUser.uid) : null),
    enabled: !!currentUser,
  })

  console.log(userData)

  const queryClient = useQueryClient()
  const [completedWorkouts, setCompletedWorkouts] = useState<Set<string>>(new Set())

  // Sync state with user data when loaded
  useEffect(() => {
    if (userData?.traineeGoals?.completedWorkouts) {
      setCompletedWorkouts(new Set(userData.traineeGoals.completedWorkouts))
    }
  }, [userData])

  const { mutate: updateGoals } = useMutation({
    mutationFn: (newCompletedWorkouts: string[]) =>
      updateTraineeGoals(currentUser!.uid, { completedWorkouts: newCompletedWorkouts }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', currentUser?.uid] })
    },
  })

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
    updateGoals(Array.from(newSet))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
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
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Workout Plan</h1>
          <p className="text-muted-foreground mt-1 capitalize ">
            {userData ? userData.traineeGoals.targetTimeline : null} •{' '}
            {userData ? userData.traineeGoals.frequencyPerWeek : null} Days/Week
          </p>
        </div>

        {/* Progress Card */}
        <Card className="w-full md:w-auto bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="relative flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  className="text-primary/20"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="transparent"
                  r="30"
                  cx="32"
                  cy="32"
                />
                <circle
                  className="text-primary"
                  strokeWidth="4"
                  strokeDasharray={188}
                  strokeDashoffset={188 - (188 * progressPercentage) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="30"
                  cx="32"
                  cy="32"
                />
              </svg>
              <span className="absolute text-sm font-bold">{progressPercentage}%</span>
            </div>
            <div>
              <p className="text-sm font-medium">Overall Progress</p>
              <p className="text-xs text-muted-foreground">
                {completedCount} of {totalWorkouts} workouts completed
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Details & Goals */}
      {userData?.traineeGoals && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Current Goals & Focus
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Main Goal</p>
              <p className="font-semibold">{userData.traineeGoals.goals[0] || 'General Fitness'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Intensity Level</p>
              <p className="font-semibold capitalize">{userData.activityLevel || 'Standard'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Weekly Commitment</p>
              <p className="font-semibold">{userData.traineeGoals.frequencyPerWeek} Days/Week</p>
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
          </CardContent>
        </Card>
      )}

      {/* Workout Plan Tabs */}
      <Tabs defaultValue="week-1" className="w-full">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <TabsList className="h-auto flex-wrap justify-start w-full">
            {currentWorkoutPlan.workoutPlan.map(week => {
              const isWeekCompleted = week.schedule.every(day =>
                completedWorkouts.has(`${week.weekNumber}-${day.day}`)
              )

              return (
                <TabsTrigger
                  key={week.weekNumber}
                  value={`week-${week.weekNumber}`}
                  className="px-6 py-2 flex items-center gap-2"
                >
                  Week {week.weekNumber}
                  {isWeekCompleted && <CheckCircle2 className="h-4 w-4 text-primary" />}
                </TabsTrigger>
              )
            })}
          </TabsList>

          <Badge variant="outline" className="text-sm py-1 px-3">
            Focus: {currentWorkoutPlan.workoutPlan.find(w => w.weekNumber === 1)?.focus}
          </Badge>
        </div>

        {currentWorkoutPlan.workoutPlan.map(week => (
          <TabsContent
            key={week.weekNumber}
            value={`week-${week.weekNumber}`}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {week.schedule.map(day => {
                const key = `${week.weekNumber}-${day.day}`
                const isCompleted = completedWorkouts.has(key)
                const isRestDay = day.workoutType.toLowerCase().includes('rest')

                return (
                  <Card
                    key={day.day}
                    className={cn(
                      'flex flex-col transition-all duration-200 hover:shadow-md',
                      isCompleted ? 'bg-primary/5 border-primary/30' : '',
                      isRestDay ? 'opacity-80 bg-muted/30' : ''
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge variant={isRestDay ? 'secondary' : 'default'} className="mb-2">
                          Day {day.day}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            'h-8 w-8 rounded-full',
                            isCompleted
                              ? 'text-primary hover:text-primary/80'
                              : 'text-muted-foreground hover:text-primary'
                          )}
                          onClick={() => toggleWorkoutCompletion(week.weekNumber, day.day)}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-6 w-6" />
                          ) : (
                            <Circle className="h-6 w-6" />
                          )}
                        </Button>
                      </div>
                      <CardTitle className="text-xl leading-tight">{day.workoutType}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">
                        {day.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1 pb-3">
                      {!isRestDay && (
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{day.durationMinutes} min</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Flame className="h-4 w-4" />
                            <span>{day.caloriesBurned} cal</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                            <Activity className="h-4 w-4" />
                            <span>
                              Intensity:{' '}
                              <span className="font-medium text-foreground">{day.intensity}</span>
                            </span>
                          </div>
                        </div>
                      )}
                      {isRestDay && (
                        <div className="flex items-center justify-center h-full min-h-[40px] text-muted-foreground italic">
                          Take it easy today! 🌿
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="pt-0">
                      <Button
                        variant={isCompleted ? 'outline' : 'default'}
                        className="w-full"
                        onClick={() => toggleWorkoutCompletion(week.weekNumber, day.day)}
                      >
                        {isCompleted ? 'Completed' : 'Mark Complete'}
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Target Timeline Footer */}
      <Separator />
      <div className="flex flex-col items-center justify-center p-6 text-center space-y-2 bg-muted/20 rounded-lg">
        <Trophy className="h-8 w-8 text-primary mb-2" />
        <h3 className="text-lg font-semibold">Keep Pushing!</h3>
        <p className="text-muted-foreground max-w-md">
          Your target timeline for this program is{' '}
          <span className="font-bold text-foreground capitalize">
            {userData ? userData.traineeGoals.targetTimeline : null}
          </span>
          . Stay consistent and track your progress daily to reach your fitness goals!
        </p>
      </div>
    </div>
  )
}

export default WorkoutPlan

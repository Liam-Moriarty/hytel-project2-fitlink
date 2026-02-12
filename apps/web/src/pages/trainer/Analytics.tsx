import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAuth } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { getTrainerProfile, getTrainerClients } from '@/lib/api/trainer'
import { generateAnalyticsDataset } from '@/lib/api/trainer-analytics'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts'
import { Activity, TrendingUp, Target, Flame, UtensilsCrossed } from 'lucide-react'
import { TraineeAnalytics, AnalyticsChartData, UserData } from '@/interface'

const CHART_COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))']

const Analytics = () => {
  const auth = getAuth()
  const currentUser = auth.currentUser
  const [selectedTrainees, setSelectedTrainees] = useState<string[]>([])

  // Fetch trainer profile
  const { data: trainerProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['trainerProfile', currentUser?.uid],
    queryFn: () => (currentUser ? getTrainerProfile(currentUser.uid) : null),
    enabled: !!currentUser,
  })

  console.log('trainer profile', trainerProfile)

  // Fetch trainer's clients
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ['trainerClients', trainerProfile?.traineeIds],
    queryFn: () => (trainerProfile ? getTrainerClients(trainerProfile.traineeIds) : []),
    enabled: !!trainerProfile?.traineeIds && trainerProfile.traineeIds.length > 0,
  })

  console.log('clients', clients)

  // Fetch full data (including trainee goals) for selected trainees
  const selectedTraineeQueries = useQuery({
    queryKey: ['selectedTraineesData', selectedTrainees],
    queryFn: async () => {
      if (selectedTrainees.length === 0) return []

      /* eslint-disable @typescript-eslint/no-explicit-any */
      const promises = selectedTrainees.map(async traineeId => {
        const userRef = doc(db, 'users', traineeId)
        const userSnap = await getDoc(userRef)

        if (!userSnap.exists()) return null

        const userData = userSnap.data()

        // Fetch trainee goals
        let traineeData = null
        if (userData.role === 'trainee') {
          const goalsRef = doc(db, 'traineeGoals', traineeId)
          const goalsSnap = await getDoc(goalsRef)
          traineeData = goalsSnap.exists() ? goalsSnap.data() : null
        }

        return {
          ...userData,
          traineeGoals: traineeData,
        } as UserData & { traineeGoals: any }
      })
      /* eslint-enable @typescript-eslint/no-explicit-any */

      const results = await Promise.all(promises)
      return results.filter(data => data !== null) as UserData[]
    },
    enabled: selectedTrainees.length > 0,
  })

  // Generate analytics data for selected trainees
  const analyticsData: TraineeAnalytics[] = useMemo(() => {
    if (!selectedTraineeQueries.data) return []
    return selectedTraineeQueries.data.map(client => generateAnalyticsDataset(client))
  }, [selectedTraineeQueries.data])

  console.log('analytics data', analyticsData)

  // Transform analytics data into chart format
  const chartData: AnalyticsChartData[] = useMemo(() => {
    if (analyticsData.length === 0) return []

    // Determine the maximum week number across all selected trainees
    const maxWeek = Math.max(...analyticsData.map(d => d.currentWeek))

    // Create an array for each week from 1 to maxWeek
    const weeks: AnalyticsChartData[] = []
    for (let week = 1; week <= maxWeek; week++) {
      const weekData: AnalyticsChartData = { week }

      analyticsData.forEach(trainee => {
        const weekCalories = trainee.weeklyCalories.find(w => w.weekNumber === week)
        weekData[trainee.userId] = weekCalories?.caloriesBurned || 0
      })

      weeks.push(weekData)
    }

    return weeks
  }, [analyticsData])

  console.log('chart data', chartData)

  // Chart configuration
  const chartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {}
    analyticsData.forEach((trainee, index) => {
      config[trainee.userId] = {
        label: trainee.userName,
        color: CHART_COLORS[index] || 'hsl(var(--primary))',
      }
    })
    return config
  }, [analyticsData])

  console.log('chart config', chartConfig)

  // Handle trainee selection (single select)
  const handleTraineeSelect = (traineeId: string) => {
    setSelectedTrainees(prev => {
      if (prev.includes(traineeId)) {
        // Deselect if already selected
        return []
      } else {
        // Select only this trainee
        return [traineeId]
      }
    })
  }

  // Calculate aggregate stats from selected trainees
  const aggregateStats = useMemo(() => {
    if (analyticsData.length === 0) {
      return {
        totalWorkouts: 0,
        totalCalories: 0,
        avgProgress: 0,
        maxCurrentWeek: 0,
        avgDietaryAdherence: 0,
      }
    }

    return {
      totalWorkouts: analyticsData.reduce((sum, t) => sum + t.totalWorkoutsCompleted, 0),
      totalCalories: analyticsData.reduce((sum, t) => sum + t.totalCaloriesBurned, 0),
      avgProgress: Math.round(
        analyticsData.reduce((sum, t) => sum + t.progressPercentage, 0) / analyticsData.length
      ),
      maxCurrentWeek: Math.max(...analyticsData.map(t => t.currentWeek)),
      avgDietaryAdherence: Math.round(
        analyticsData.reduce((sum, t) => sum + t.dietaryAdherencePercentage, 0) /
          analyticsData.length
      ),
    }
  }, [analyticsData])

  console.log('aggregate stats', aggregateStats)

  const isLoading = isLoadingProfile || isLoadingClients

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-8 max-w-7xl">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-7xl animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Track and compare trainee progress with detailed calorie burn metrics
        </p>
      </div>

      {/* Trainee Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select a Trainee</CardTitle>
          <CardDescription>Choose a trainee to view their analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {clients.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No trainees found. Add trainees to get started.
              </p>
            ) : (
              clients.map(client => (
                <Badge
                  key={client.uid}
                  variant={selectedTrainees.includes(client.uid) ? 'default' : 'outline'}
                  className="cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105 capitalize"
                  onClick={() => handleTraineeSelect(client.uid)}
                >
                  {client.displayName || client.email}
                  {selectedTrainees.includes(client.uid) && (
                    <span className="ml-2 font-bold">✓</span>
                  )}
                </Badge>
              ))
            )}
          </div>
          {selectedTrainees.length > 0 && (
            <p className="text-xs text-muted-foreground mt-3">1 trainee selected</p>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      {selectedTrainees.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{aggregateStats.totalWorkouts}</div>
              <p className="text-xs text-muted-foreground">Selected trainee</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Calories Burned</CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {aggregateStats.totalCalories.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Total calorie burn</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{aggregateStats.avgProgress}%</div>
              <p className="text-xs text-muted-foreground">Completion rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Week</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Week {aggregateStats.maxCurrentWeek}</div>
              <p className="text-xs text-muted-foreground">Latest active week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dietary Adherence</CardTitle>
              <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{aggregateStats.avgDietaryAdherence}%</div>
              <p className="text-xs text-muted-foreground">Average adherence</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Line Chart */}
      {selectedTrainees.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Weekly Calorie Burn Progress</CardTitle>
            <CardDescription>Track calorie burn progress week by week</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="week"
                    tickFormatter={value => `Week ${value}`}
                    className="text-sm"
                  />
                  <YAxis
                    label={{ value: 'Calories Burned', angle: -90, position: 'insideLeft' }}
                    className="text-sm"
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={value => `Week ${value}`}
                        formatter={(value, name) => [
                          `${value} cal`,
                          chartConfig[name as string]?.label || name,
                        ]}
                      />
                    }
                  />
                  <Legend
                    formatter={value => chartConfig[value]?.label || value}
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                  {analyticsData.map((trainee, index) => (
                    <Line
                      key={trainee.userId}
                      type="monotone"
                      dataKey={trainee.userId}
                      stroke={CHART_COLORS[index]}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name={trainee.userName}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-[400px] text-center space-y-4">
            <Activity className="h-16 w-16 text-muted-foreground/50" />
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No Trainees Selected</h3>
              <p className="text-muted-foreground max-w-md">
                Select a trainee from the list above to view their calorie burn progress
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Individual Trainee Details */}
      {analyticsData.length > 0 && (
        <div className="grid grid-cols-1 gap-6">
          {analyticsData.map(trainee => (
            <Card key={trainee.userId}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{trainee.userName}</span>
                  <Badge variant="secondary">{trainee.progressPercentage}% Complete</Badge>
                </CardTitle>
                <CardDescription>{trainee.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Workouts Completed</p>
                    <p className="text-2xl font-bold">{trainee.totalWorkoutsCompleted}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Calories</p>
                    <p className="text-2xl font-bold">
                      {trainee.totalCaloriesBurned.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Week</p>
                    <p className="text-2xl font-bold">Week {trainee.currentWeek}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Timeline</p>
                    <p className="text-lg font-semibold">
                      {trainee.targetTimeline?.replace('_', ' ') || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dietary Adherence</p>
                    <p className="text-2xl font-bold text-green-600">
                      {trainee.dietaryAdherencePercentage}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Meals Completed</p>
                    <p className="text-2xl font-bold">
                      {trainee.totalMealDaysCompleted}/{trainee.totalMealDays}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default Analytics

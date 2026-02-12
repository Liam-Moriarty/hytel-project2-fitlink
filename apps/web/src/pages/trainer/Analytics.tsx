import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAuth } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { getTrainerProfile, getTrainerClients } from '@/lib/api/trainer'
import { generateAnalyticsDataset } from '@/lib/api/trainer-analytics'
import { Skeleton } from '@/components/ui/skeleton'
import { TraineeAnalytics, AnalyticsChartData, UserData } from '@/interface'

// Section Components
import Header from '@/sections/trainer/analytics/Header'
import TraineeSelector from '@/sections/trainer/analytics/TrainerSelector'
import StatsGrid from '@/sections/trainer/analytics/StatsGrid'
import ProgressLineChart from '@/sections/trainer/analytics/ProgressLineChart'
import IndividualTraineeDetails from '@/sections/trainer/analytics/IndividualTraineeDetails'

const CHART_COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))']
const DIETARY_COLORS = ['hsl(var(--chart-3))', 'hsl(var(--chart-4))']

const Analytics = () => {
  const auth = getAuth()
  const currentUser = auth.currentUser
  const [selectedTrainees, setSelectedTrainees] = useState<string[]>([])

  // Fetch trainer profile
  const { data: trainerProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['trainerProfile', currentUser?.uid],
    queryFn: () => (currentUser ? getTrainerProfile(currentUser.uid) : null),
    enabled: !!currentUser,
    refetchInterval: 5000, // Real-time updates every 5 seconds
  })

  // Fetch trainer's clients
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ['trainerClients', trainerProfile?.traineeIds],
    queryFn: () => (trainerProfile ? getTrainerClients(trainerProfile.traineeIds) : []),
    enabled: !!trainerProfile?.traineeIds && trainerProfile.traineeIds.length > 0,
    refetchInterval: 5000, // Real-time updates every 5 seconds
  })

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
    refetchInterval: 5000, // Real-time updates every 5 seconds
  })

  // Generate analytics data for selected trainees
  const analyticsData: TraineeAnalytics[] = useMemo(() => {
    if (!selectedTraineeQueries.data) return []
    return selectedTraineeQueries.data.map(client => generateAnalyticsDataset(client))
  }, [selectedTraineeQueries.data])

  // Transform analytics data into chart format (Calories)
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

  // Transform analytics data into chart format (Dietary Adherence)
  const dietaryChartData: AnalyticsChartData[] = useMemo(() => {
    if (analyticsData.length === 0) return []

    // Determine the maximum week number across all selected trainees
    const maxWeek = Math.max(...analyticsData.map(d => d.currentWeek))

    // Create an array for each week from 1 to maxWeek
    const weeks: AnalyticsChartData[] = []
    for (let week = 1; week <= maxWeek; week++) {
      const weekData: AnalyticsChartData = { week }

      analyticsData.forEach(trainee => {
        const weekDietary = trainee.weeklyDietaryAdherence.find(w => w.weekNumber === week)
        weekData[`dietary-${trainee.userId}`] = weekDietary?.adherencePercentage || 0
      })

      weeks.push(weekData)
    }

    return weeks
  }, [analyticsData])

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

  // Dietary Chart configuration
  const dietaryChartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {}
    analyticsData.forEach((trainee, index) => {
      config[`dietary-${trainee.userId}`] = {
        label: trainee.userName,
        color: DIETARY_COLORS[index] || 'hsl(var(--primary))',
      }
    })
    return config
  }, [analyticsData])

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
      <Header />

      <TraineeSelector
        clients={clients}
        selectedTrainees={selectedTrainees}
        onTraineeSelect={handleTraineeSelect}
      />

      {selectedTrainees.length > 0 && <StatsGrid aggregateStats={aggregateStats} />}

      <ProgressLineChart
        selectedTrainees={selectedTrainees}
        chartData={chartData}
        dietaryChartData={dietaryChartData}
        analyticsData={analyticsData}
        chartConfig={chartConfig}
        dietaryChartConfig={dietaryChartConfig}
      />

      <IndividualTraineeDetails analyticsData={analyticsData} />
    </div>
  )
}

export default Analytics

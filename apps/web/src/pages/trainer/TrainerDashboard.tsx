import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAuth } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { getTrainerProfile, getTrainerClients } from '@/lib/api/trainer'
import { generateAnalyticsDataset } from '@/lib/api/trainer-analytics'
import { UserData } from '@/interface'
import { useNavigate } from 'react-router-dom'

// Section Components
import TrainerHeader from '@/sections/trainer/dashboard/TrainerHeader'
import TrainerStatsGrid from '@/sections/trainer/dashboard/TrainerStatsGrid'
import ClientProgressSummary from '@/sections/trainer/dashboard/ClientProgressSummary'
import DietaryProgressSummary from '@/sections/trainer/dashboard/DietaryProgressSummary'
import ScheduleOverview from '@/sections/trainer/dashboard/ScheduleOverview'
import QuickActions from '@/sections/trainer/dashboard/QuickActions'
import CalorieBurnChartSummary from '@/sections/trainer/dashboard/CalorieBurnChartSummary'

const TrainerDashboard = () => {
  const auth = getAuth()
  const currentUser = auth.currentUser
  const navigate = useNavigate()

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

  // Fetch full data for ALL clients (users + goals) to generate analytics
  const { data: clientsData = [], isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ['allClientsAnalyticsData', clients],
    queryFn: async () => {
      if (clients.length === 0) return []

      /* eslint-disable @typescript-eslint/no-explicit-any */
      const promises = clients.map(async client => {
        const userRef = doc(db, 'users', client.uid)
        const userSnap = await getDoc(userRef)

        if (!userSnap.exists()) return null

        const userData = userSnap.data()

        // Fetch trainee goals
        let traineeGoals = null
        if (userData.role === 'trainee') {
          const goalsRef = doc(db, 'traineeGoals', client.uid)
          const goalsSnap = await getDoc(goalsRef)
          traineeGoals = goalsSnap.exists() ? goalsSnap.data() : null
        }

        return {
          ...userData,
          traineeGoals: traineeGoals,
        } as UserData & { traineeGoals: any }
      })
      /* eslint-enable @typescript-eslint/no-explicit-any */

      const results = await Promise.all(promises)
      return results.filter(data => data !== null) as UserData[]
    },
    enabled: clients.length > 0,
    refetchInterval: 5000, // Real-time updates every 5 seconds
  })

  // Generate analytics dataset
  const analyticsData = useMemo(() => {
    return clientsData.map(client => generateAnalyticsDataset(client))
  }, [clientsData])

  // Calculate aggregated stats
  const stats = useMemo(() => {
    const totalClients = clients.length
    const totalWorkouts = analyticsData.reduce((sum, t) => sum + t.totalWorkoutsCompleted, 0)
    const totalCalories = analyticsData.reduce((sum, t) => sum + t.totalCaloriesBurned, 0)

    // Average success rate (progress percentage)
    const successRate =
      totalClients > 0
        ? Math.round(analyticsData.reduce((sum, t) => sum + t.progressPercentage, 0) / totalClients)
        : 0

    return {
      totalClients,
      totalWorkouts,
      totalCalories,
      successRate,
    }
  }, [clients, analyticsData])

  // Get current user data for header greeting
  const { data: userData } = useQuery({
    queryKey: ['user', currentUser?.uid],
    queryFn: async () => {
      if (!currentUser) return null
      const docRef = doc(db, 'users', currentUser.uid)
      const snap = await getDoc(docRef)
      return snap.exists() ? (snap.data() as UserData) : null
    },
    enabled: !!currentUser,
    refetchInterval: 5000, // Real-time updates every 5 seconds
  })

  const isLoading = isLoadingProfile || isLoadingClients || isLoadingAnalytics

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-4 max-w-7xl animate-in fade-in duration-500">
      <TrainerHeader userData={userData ?? null} />

      <TrainerStatsGrid
        totalClients={stats.totalClients}
        totalWorkouts={stats.totalWorkouts}
        successRate={stats.successRate}
        totalCalories={stats.totalCalories}
      />

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
        {/* Left Column: Client Progress & Dietary Progress */}
        <div className="lg:col-span-2 space-y-6">
          <ClientProgressSummary clients={analyticsData} navigate={navigate} />
          <DietaryProgressSummary clients={analyticsData} navigate={navigate} />
        </div>

        {/* Right Column: Schedule & Quick Actions */}
        <div className="space-y-6">
          <ScheduleOverview availability={trainerProfile?.availability || []} navigate={navigate} />
          <QuickActions navigate={navigate} />
        </div>
      </div>

      <CalorieBurnChartSummary clients={clients} analyticsData={analyticsData} />
    </div>
  )
}

export default TrainerDashboard

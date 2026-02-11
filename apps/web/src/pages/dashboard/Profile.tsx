import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getFullUser } from '@/lib/api/user'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useQuery } from '@tanstack/react-query'
import { Activity, Bell, LogOut, Ruler, Settings, Target, User, Weight, Clock } from 'lucide-react'
import { EditProfileSheet } from '../../components/EditProfileSheet'
import { useLogoutMutation } from '@/hooks/useAuth'

const Profile = () => {
  const { userData } = useAuthStore()
  const logoutMutation = useLogoutMutation()

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userData?.uid],
    queryFn: () => getFullUser(userData!.uid),
    enabled: !!userData?.uid,
  })

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    )
  }

  if (!user) {
    return <div>User not found</div>
  }

  const traineeGoals = user.traineeGoals || {}

  return (
    <div className="flex flex-col gap-6 p-6 mx-auto max-w-7xl">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-xl bg-background p-8 shadow-lg">
        <div className="relative z-10 flex items-center gap-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-4xl font-bold text-x text-primary-foreground">
            {user.profilePicUrl ? (
              <img
                src={user.profilePicUrl}
                alt={user.displayName || 'User'}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              (user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase()
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{user.displayName || 'User'}</h1>
            <p className="opacity-90 text-foreground">{user.email}</p>
            <div className="mt-2 flex gap-2">
              <Badge
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-primary border-none"
              >
                {user.role === 'trainee' ? 'Trainee' : 'Trainer'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content - Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Current Goals</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3 rounded-lg p-4 border ">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Primary Goals</p>
                  <p className="text-sm font-semibold">
                    {traineeGoals.goals?.length > 0 ? traineeGoals.goals[0] : 'Not set'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg p-4 border ">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-200">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Timeline</p>
                  <p className="text-sm font-semibold">
                    {traineeGoals.targetTimeline || 'Not set'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg p-4 border ">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-800 dark:text-purple-200">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Fitness Level</p>
                  <p className="text-sm font-semibold capitalize">
                    {user.activityLevel || 'Not set'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-medium text-lg flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {user.age || '-'} years
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-muted-foreground">Height</p>
                  <p className="font-medium text-lg flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    {user.height || '-'} cm
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p className="font-medium text-lg flex items-center gap-2">
                    <Weight className="h-4 w-4 text-muted-foreground" />
                    {user.weight || '-'} kg
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium text-lg capitalize">{user.gender || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workout Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Workout Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-muted-foreground">Activity Level</p>
                  <p className="font-medium capitalize">{user.activityLevel || '-'}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-muted-foreground">Exercise Days</p>
                  <p className="font-medium">{traineeGoals.frequencyPerWeek || '0'} days/week</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">30-45 mins</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Preferred Workout Types</p>
                <div className="flex flex-wrap gap-2">
                  {traineeGoals.preferredWorkoutTypes?.length > 0 ? (
                    traineeGoals.preferredWorkoutTypes.map((type: string) => (
                      <Badge key={type} variant="secondary" className="px-3 py-1 bg-primary">
                        {type}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No preferences set</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Adjust Sidebar / Right Column */}
        <div className="space-y-6">
          {/* Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Notifications</p>
                  <p className="text-xs text-muted-foreground">Manage alerts and reminders</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">App Settings</p>
                  <p className="text-xs text-muted-foreground">Customize your experience</p>
                </div>
              </div>

              <div className="pt-2">
                <EditProfileSheet user={user} />
              </div>
            </CardContent>
          </Card>

          {/* Additional Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Additional Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {traineeGoals.goals && traineeGoals.goals.length > 0 ? (
                  traineeGoals.goals.map((goal: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      {goal}
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No goals set</p>
                )}
              </ul>
            </CardContent>
          </Card>

          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => logoutMutation.mutate()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Profile

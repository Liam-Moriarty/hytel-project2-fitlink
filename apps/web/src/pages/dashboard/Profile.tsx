import { Skeleton } from '@/components/ui/skeleton'
import { getFullUser } from '@/lib/api/user'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useQuery } from '@tanstack/react-query'

// Section Components
import Header from '@/sections/profile/Header'
import CurrentGoals from '@/sections/profile/CurrentGoals'
import PersonalInfo from '@/sections/profile/PersonalInfo'
import WorkoutPreferences from '@/sections/profile/WorkoutPreferences'
import SettingsCard from '@/sections/profile/SettingsCard'
import AdditionalGoals from '@/sections/profile/AdditionalGoals'
import LogoutButton from '@/sections/profile/LogoutButton'

const Profile = () => {
  const { userData } = useAuthStore()

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userData?.uid],
    queryFn: () => getFullUser(userData!.uid),
    enabled: !!userData?.uid,
  })

  if (isLoading) {
    return (
      <div className="p-8 space-y-4 mx-auto max-w-7xl">
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

  return (
    <div className="flex flex-col gap-6 p-6 mx-auto max-w-7xl">
      <Header user={user} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content - Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <CurrentGoals user={user} />
          <PersonalInfo user={user} />
          <WorkoutPreferences user={user} />
        </div>

        {/* Adjust Sidebar / Right Column */}
        <div className="space-y-6">
          <SettingsCard user={user} />
          <AdditionalGoals user={user} />
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}

export default Profile

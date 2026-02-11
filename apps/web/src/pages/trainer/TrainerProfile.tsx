import { Skeleton } from '@/components/ui/skeleton'
import { getFullUser } from '@/lib/api/user'
import { getTrainerProfile } from '@/lib/api/trainer'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useQuery } from '@tanstack/react-query'

// Section Components
import Header from '@/sections/trainer/profile/Header'
import TrainerOverview from '@/sections/trainer/profile/TrainerOverview'
import PersonalInfo from '@/sections/trainer/profile/PersonalInfo'
import Specialties from '@/sections/trainer/profile/Specialties'
import SettingsCard from '@/sections/trainer/profile/SettingsCard'

const TrainerProfile = () => {
  const { userData } = useAuthStore()

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['user', userData?.uid],
    queryFn: () => getFullUser(userData!.uid),
    enabled: !!userData?.uid,
  })

  const { data: trainerProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['trainerProfile', userData?.uid],
    queryFn: () => getTrainerProfile(userData!.uid),
    enabled: !!userData?.uid,
  })

  const isLoading = isUserLoading || isProfileLoading

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

  const clientCount = trainerProfile?.traineeIds?.length ?? 0
  const certificationsCount = trainerProfile?.certifications?.length ?? 0
  const availableDaysCount = trainerProfile?.availability?.length ?? 0

  return (
    <div className="flex flex-col gap-6 p-6 mx-auto max-w-7xl">
      <Header user={user} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content - Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <TrainerOverview
            clientCount={clientCount}
            certificationsCount={certificationsCount}
            availableDaysCount={availableDaysCount}
          />
          <PersonalInfo user={user} />
          {trainerProfile && (
            <Specialties trainerId={user.uid} specialties={trainerProfile.specialties ?? []} />
          )}
        </div>

        {/* Sidebar / Right Column */}
        <div className="space-y-6">
          <SettingsCard user={user} />
        </div>
      </div>
    </div>
  )
}

export default TrainerProfile

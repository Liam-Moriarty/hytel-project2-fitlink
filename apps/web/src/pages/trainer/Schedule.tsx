import { getAuth } from 'firebase/auth'
import { useQuery } from '@tanstack/react-query'
import { getTrainerProfile } from '@/lib/api/trainer'

// Section Components
import Header from '@/sections/trainer/schedule/Header'
import AvailabilityCard from '@/sections/trainer/schedule/AvailabilityCard'
import CertificationsCard from '@/sections/trainer/schedule/CertificationsCard'

const Schedule = () => {
  const auth = getAuth()
  const currentUser = auth.currentUser

  const { data: trainerProfile } = useQuery({
    queryKey: ['trainerProfile', currentUser?.uid],
    queryFn: () => (currentUser ? getTrainerProfile(currentUser.uid) : null),
    enabled: !!currentUser,
  })

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-8 max-w-7xl">
      <Header availableDaysCount={trainerProfile?.availability?.length ?? 0} />

      <AvailabilityCard
        trainerId={currentUser.uid}
        availability={trainerProfile?.availability ?? []}
      />

      <CertificationsCard
        trainerId={currentUser.uid}
        certifications={trainerProfile?.certifications ?? []}
      />
    </div>
  )
}

export default Schedule

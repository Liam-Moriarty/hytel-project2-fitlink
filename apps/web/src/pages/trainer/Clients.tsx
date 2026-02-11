import { getAuth } from 'firebase/auth'
import { useQuery } from '@tanstack/react-query'
import { getTrainerProfile, getTrainerClients } from '@/lib/api/trainer'

// Section Components
import Header from '@/sections/trainer/clients/Header'
import InviteCard from '@/sections/trainer/clients/InviteCard'
import ClientsTable from '@/sections/trainer/clients/ClientsTable'

const Clients = () => {
  const auth = getAuth()
  const currentUser = auth.currentUser

  const { data: trainerProfile } = useQuery({
    queryKey: ['trainerProfile', currentUser?.uid],
    queryFn: () => (currentUser ? getTrainerProfile(currentUser.uid) : null),
    enabled: !!currentUser,
  })

  const traineeIds = trainerProfile?.traineeIds ?? []

  const { data: clients = [], isLoading: isClientsLoading } = useQuery({
    queryKey: ['trainerClients', traineeIds],
    queryFn: () => getTrainerClients(traineeIds),
    enabled: traineeIds.length > 0,
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
      <Header clientCount={clients.length} />

      <InviteCard trainerId={currentUser.uid} existingTraineeIds={traineeIds} />

      <ClientsTable
        clients={clients}
        trainerId={currentUser.uid}
        isLoading={isClientsLoading && traineeIds.length > 0}
      />
    </div>
  )
}

export default Clients

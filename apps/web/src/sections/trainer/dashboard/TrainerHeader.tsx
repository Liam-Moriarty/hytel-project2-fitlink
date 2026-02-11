import { UserData } from '@/interface'

interface TrainerHeaderProps {
  userData: UserData | null
}

const TrainerHeader = ({ userData }: TrainerHeaderProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <h1 className="text-3xl font-bold tracking-tight capitalize">
        Welcome back, Coach {userData?.displayName || ''}! 👋
      </h1>
      <p className="text-muted-foreground">Here's your coaching summary</p>
    </div>
  )
}

export default TrainerHeader

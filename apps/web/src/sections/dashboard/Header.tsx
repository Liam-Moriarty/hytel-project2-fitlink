import { DashboardHeaderProps } from '@/interface'

const Header = ({ userData }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <h1 className="text-3xl font-bold tracking-tight">
        Welcome back, {userData?.displayName || 'Trainee'}! 👋
      </h1>
      <p className="text-muted-foreground">Here's your fitness summary</p>
    </div>
  )
}

export default Header

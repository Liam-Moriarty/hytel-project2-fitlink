import { Badge } from '@/components/ui/badge'
import { UserData } from '@/interface'

interface HeaderProps {
  user: UserData
}

const Header = ({ user }: HeaderProps) => {
  return (
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
  )
}

export default Header

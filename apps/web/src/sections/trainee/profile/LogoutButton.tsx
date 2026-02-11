import { Button } from '@/components/ui/button'
import { useLogoutMutation } from '@/hooks/useAuth'
import { LogOut } from 'lucide-react'

const LogoutButton = () => {
  const logoutMutation = useLogoutMutation()

  return (
    <Button
      variant="ghost"
      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
      onClick={() => logoutMutation.mutate()}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Log Out
    </Button>
  )
}

export default LogoutButton

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserPlus, Calendar, BarChart, Settings } from 'lucide-react'
import { QuickActionsProps } from '@/interface'

const QuickActions = ({ navigate }: QuickActionsProps) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="h-24 flex flex-col gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
          onClick={() => navigate('clients')}
        >
          <UserPlus className="h-6 w-6" />
          <span>Invite Client</span>
        </Button>

        <Button
          variant="outline"
          className="h-24 flex flex-col gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
          onClick={() => navigate('schedule')}
        >
          <Calendar className="h-6 w-6" />
          <span>Update Schedule</span>
        </Button>

        <Button
          variant="outline"
          className="h-24 flex flex-col gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
          onClick={() => navigate('analytics')}
        >
          <BarChart className="h-6 w-6" />
          <span>Full Analytics</span>
        </Button>

        <Button
          variant="outline"
          className="h-24 flex flex-col gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
          onClick={() => navigate('profile')}
        >
          <Settings className="h-6 w-6" />
          <span>Edit Profile</span>
        </Button>
      </CardContent>
    </Card>
  )
}

export default QuickActions

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell, Settings } from 'lucide-react'
import { EditProfileSheet } from '@/components/EditProfileSheet'
import { ProfileUserProps } from '@/interface'

const SettingsCard = ({ user }: ProfileUserProps) => {
  return (
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
  )
}

export default SettingsCard

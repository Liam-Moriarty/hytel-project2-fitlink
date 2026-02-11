import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Ruler, User, Weight } from 'lucide-react'
import { ProfileUserProps } from '@/interface'

const PersonalInfo = ({ user }: ProfileUserProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Age</p>
            <p className="font-medium text-lg flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              {user.age || '-'} years
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Height</p>
            <p className="font-medium text-lg flex items-center gap-2">
              <Ruler className="h-4 w-4 text-muted-foreground" />
              {user.height || '-'} cm
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Weight</p>
            <p className="font-medium text-lg flex items-center gap-2">
              <Weight className="h-4 w-4 text-muted-foreground" />
              {user.weight || '-'} kg
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Gender</p>
            <p className="font-medium text-lg capitalize">{user.gender || '-'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PersonalInfo

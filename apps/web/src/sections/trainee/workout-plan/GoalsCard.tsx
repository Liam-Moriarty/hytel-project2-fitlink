import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Target } from 'lucide-react'
import { GoalsCardProps } from '@/interface'

const GoalsCard = ({ userData }: GoalsCardProps) => {
  if (!userData?.traineeGoals) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Current Goals & Focus
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Main Goal</p>
          <p className="font-semibold">{userData.traineeGoals.goals[0] || 'General Fitness'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Intensity Level</p>
          <p className="font-semibold capitalize">{userData.activityLevel || 'Standard'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Weekly Commitment</p>
          <p className="font-semibold">{userData.traineeGoals.frequencyPerWeek} Days/Week</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Target Timeline</p>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-semibold text-primary capitalize">
              {userData.traineeGoals.targetTimeline}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default GoalsCard

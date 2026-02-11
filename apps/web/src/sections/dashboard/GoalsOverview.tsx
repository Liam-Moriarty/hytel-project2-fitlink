import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Target } from 'lucide-react'
import { GoalsOverviewProps } from '@/interface'

const GoalsOverview = ({ userData }: GoalsOverviewProps) => {
  if (!userData?.traineeGoals) return null

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Your Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Main Goal</p>
          <p className="font-semibold">{userData.traineeGoals.goals[0] || 'General Fitness'}</p>
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
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Weekly Frequency</p>
          <p className="font-semibold">{userData.traineeGoals.frequencyPerWeek} Days/Week</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Activity Level</p>
          <p className="font-semibold capitalize">{userData.activityLevel || 'Standard'}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default GoalsOverview

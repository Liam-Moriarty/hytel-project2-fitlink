import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Clock, Target } from 'lucide-react'
import { ProfileUserProps } from '@/interface'

const CurrentGoals = ({ user }: ProfileUserProps) => {
  const traineeGoals = user.traineeGoals || {}

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Current Goals</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <div className="flex items-center gap-3 rounded-lg p-4 border ">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Primary Goals</p>
            <p className="text-sm font-semibold">
              {traineeGoals.goals?.length > 0 ? traineeGoals.goals[0] : 'Not set'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg p-4 border ">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-200">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Timeline</p>
            <p className="text-sm font-semibold">{traineeGoals.targetTimeline || 'Not set'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg p-4 border ">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-800 dark:text-purple-200">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Fitness Level</p>
            <p className="text-sm font-semibold capitalize">{user.activityLevel || 'Not set'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CurrentGoals

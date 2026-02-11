import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ProfileUserProps } from '@/interface'

const WorkoutPreferences = ({ user }: ProfileUserProps) => {
  const traineeGoals = user.traineeGoals || {}

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Workout Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Activity Level</p>
            <p className="font-medium capitalize">{user.activityLevel || '-'}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Exercise Days</p>
            <p className="font-medium">{traineeGoals.frequencyPerWeek || '0'} days/week</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="font-medium">30-45 mins</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Preferred Workout Types</p>
          <div className="flex flex-wrap gap-2">
            {traineeGoals.preferredWorkoutTypes?.length > 0 ? (
              traineeGoals.preferredWorkoutTypes.map((type: string) => (
                <Badge key={type} variant="secondary" className="px-3 py-1 bg-primary">
                  {type}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No preferences set</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default WorkoutPreferences

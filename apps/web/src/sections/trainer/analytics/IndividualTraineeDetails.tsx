import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { IndividualTraineeDetailsProps } from '@/interface'

const IndividualTraineeDetails = ({ analyticsData }: IndividualTraineeDetailsProps) => {
  if (analyticsData.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {analyticsData.map(trainee => (
        <Card key={trainee.userId}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{trainee.userName}</span>
              <Badge variant="secondary">{trainee.progressPercentage}% Complete</Badge>
            </CardTitle>
            <CardDescription>{trainee.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Workouts Completed</p>
                <p className="text-2xl font-bold">{trainee.totalWorkoutsCompleted}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Calories</p>
                <p className="text-2xl font-bold">{trainee.totalCaloriesBurned.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Week</p>
                <p className="text-2xl font-bold">Week {trainee.currentWeek}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Timeline</p>
                <p className="text-lg font-semibold">
                  {trainee.targetTimeline?.replace('_', ' ') || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dietary Adherence</p>
                <p className="text-2xl font-bold text-green-600">
                  {trainee.dietaryAdherencePercentage}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Meals Completed</p>
                <p className="text-2xl font-bold">
                  {trainee.totalMealDaysCompleted}/{trainee.totalMealDays}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default IndividualTraineeDetails

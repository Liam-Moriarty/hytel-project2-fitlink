import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Target } from 'lucide-react'
import { WeekProgressProps } from '@/interface'

const WeekProgress = ({ currentWeekProgress, navigate }: WeekProgressProps) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          This Week's Progress
        </CardTitle>
        <CardDescription>Week {currentWeekProgress.weekNumber}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="font-medium">
            {currentWeekProgress.completed} of {currentWeekProgress.total} workouts completed
          </span>
          <span className="text-muted-foreground">{currentWeekProgress.percentage}%</span>
        </div>
        <Progress value={currentWeekProgress.percentage} className="h-3" />

        <div className="flex justify-between items-center pt-2">
          <Button variant="outline" size="sm" onClick={() => navigate('workout-plan')}>
            View Full Plan
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('progress')}>
            View Progress
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default WeekProgress

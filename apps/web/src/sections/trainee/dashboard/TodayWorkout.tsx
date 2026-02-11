/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Activity, ArrowRight, Calendar, CheckCircle2, Clock, Flame } from 'lucide-react'
import { TodayWorkoutProps } from '@/interface'

const TodayWorkout = ({ todayWorkout, navigate }: TodayWorkoutProps) => {
  if (!todayWorkout) {
    return (
      <Card className="shadow-lg bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            All Caught Up!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You've completed all workouts in the current week. Great job! 🎉
          </p>
          <Button className="mt-4" onClick={() => navigate('workout-plan')}>
            View Workout Plan
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Today's Workout
          </CardTitle>
          <Badge variant="default">Week {todayWorkout.weekNumber}</Badge>
        </div>
        <CardDescription>Your next scheduled session</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold mb-2">{todayWorkout.workoutType}</h3>
            <p className="text-muted-foreground">{todayWorkout.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 py-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <div>
                <p className="font-semibold">{todayWorkout.durationMinutes} min</p>
                <p className="text-xs text-muted-foreground">Duration</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Flame className="h-4 w-4 text-orange-500" />
              <div>
                <p className="font-semibold">{todayWorkout.caloriesBurned} cal</p>
                <p className="text-xs text-muted-foreground">Est. Burn</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Activity className="h-4 w-4 text-blue-500" />
              <div>
                <p className="font-semibold capitalize">{todayWorkout.intensity}</p>
                <p className="text-xs text-muted-foreground">Intensity</p>
              </div>
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={() => navigate('workout-plan')}>
            Start Workout
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default TodayWorkout

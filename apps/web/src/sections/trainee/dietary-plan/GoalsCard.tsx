import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Flame, Target, Calendar, UtensilsCrossed } from 'lucide-react'
import { DietaryGoalsCardProps } from '@/interface'

const GoalsCard = ({ userData, dailyIntakeGoal, totalWeeks }: DietaryGoalsCardProps) => {
  if (!userData?.traineeGoals) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UtensilsCrossed className="h-5 w-5 text-primary" />
          Dietary Goals & Focus
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Daily Calorie Goal</p>
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <p className="font-semibold">{dailyIntakeGoal} cal</p>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Plan Duration</p>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <p className="font-semibold">{totalWeeks} Weeks</p>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Main Goal</p>
          <p className="font-semibold">{userData.traineeGoals.goals[0] || 'Balanced Nutrition'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Target Timeline</p>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
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

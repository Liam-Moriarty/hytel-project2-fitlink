import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UtensilsCrossed, Target, Flame, TrendingUp } from 'lucide-react'

interface DietaryStatsCardProps {
  totalMealDays: number
  completedMealDays: number
  adherencePercentage: number
  avgDailyCalories: number
  currentStreak: number
}

const DietaryStatsCard = ({
  totalMealDays,
  completedMealDays,
  adherencePercentage,
  avgDailyCalories,
  currentStreak,
}: DietaryStatsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UtensilsCrossed className="h-5 w-5 text-primary" />
          Dietary Progress Overview
        </CardTitle>
        <CardDescription>Track your nutritional adherence and progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Adherence */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              <span>Adherence</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{adherencePercentage}%</p>
            <p className="text-xs text-muted-foreground">
              {completedMealDays} of {totalMealDays} days
            </p>
          </div>

          {/* Avg Calories */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Flame className="h-4 w-4" />
              <span>Avg Calories</span>
            </div>
            <p className="text-2xl font-bold">{avgDailyCalories}</p>
            <p className="text-xs text-muted-foreground">calories/day</p>
          </div>

          {/* Completed Days */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UtensilsCrossed className="h-4 w-4" />
              <span>Completed Days</span>
            </div>
            <p className="text-2xl font-bold">{completedMealDays}</p>
            <p className="text-xs text-muted-foreground">meal days tracked</p>
          </div>

          {/* Current Streak */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Week Streak</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{currentStreak}</p>
            <p className="text-xs text-muted-foreground">
              {currentStreak === 1 ? 'week' : 'weeks'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DietaryStatsCard

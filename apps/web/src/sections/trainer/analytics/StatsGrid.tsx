import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatsGridProps } from '@/interface'
import { Activity, TrendingUp, Flame, UtensilsCrossed } from 'lucide-react'

const StatsGrid = ({ aggregateStats }: StatsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{aggregateStats.totalWorkouts}</div>
          <p className="text-xs text-muted-foreground">Selected trainee</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Calories Burned</CardTitle>
          <Flame className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{aggregateStats.totalCalories.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Total calorie burn</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{aggregateStats.avgProgress}%</div>
          <p className="text-xs text-muted-foreground">Completion rate</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dietary Adherence</CardTitle>
          <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{aggregateStats.avgDietaryAdherence}%</div>
          <p className="text-xs text-muted-foreground">Average adherence</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default StatsGrid

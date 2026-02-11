import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TopStatsGridProps } from '@/interface'
import { Activity, Dumbbell, Flame, Target, TrendingUp, Trophy } from 'lucide-react'

const TopStatsGrid = ({
  completionPercentage,
  totalCompleted,
  totalWorkouts,
  totalBurned,
}: TopStatsGridProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Overall Progress */}
      <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-none shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="pb-2">
          <CardDescription className="text-blue-100 flex items-center gap-2">
            <Target className="h-4 w-4" /> Overall Progress
          </CardDescription>
          <CardTitle className="text-4xl font-bold">{completionPercentage}%</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-100">
            {totalCompleted} of {totalWorkouts} workouts
          </p>
          <Progress value={completionPercentage} className="h-2 mt-2 bg-blue-200" />
        </CardContent>
      </Card>

      {/* Total Workouts */}
      <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white border-none shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="pb-2">
          <CardDescription className="text-green-100 flex items-center gap-2">
            <Dumbbell className="h-4 w-4" /> Workouts Completed
          </CardDescription>
          <CardTitle className="text-4xl font-bold">{totalCompleted}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-100">sessions finished</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Keep it up!</span>
          </div>
        </CardContent>
      </Card>

      {/* Calories Burned */}
      <Card className="bg-gradient-to-br from-amber-400 to-orange-500 text-white border-none shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="pb-2">
          <CardDescription className="text-amber-100 flex items-center gap-2">
            <Flame className="h-4 w-4" /> Calories Burned
          </CardDescription>
          <CardTitle className="text-4xl font-bold">
            {totalBurned >= 1000 ? `${(totalBurned / 1000).toFixed(1)}k` : totalBurned}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-amber-100">total calories</p>
          <div className="flex items-center gap-1 mt-2">
            <Activity className="h-4 w-4" />
            <span className="text-sm">
              Avg: {Math.round(totalBurned / (totalCompleted || 1))} cal/workout
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Current Streak */}
      <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-none shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="pb-2">
          <CardDescription className="text-orange-100 flex items-center gap-2">
            <Flame className="h-4 w-4" /> Current Streak
          </CardDescription>
          <CardTitle className="text-4xl font-bold">5</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-orange-100">days in a row</p>
          <div className="flex items-center gap-1 mt-2">
            <Trophy className="h-4 w-4" />
            <span className="text-sm">On fire! 🔥</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TopStatsGrid

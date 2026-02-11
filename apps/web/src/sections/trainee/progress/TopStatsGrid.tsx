import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TopStatsGridProps } from '@/interface'
import { Activity, Dumbbell, Flame, Target } from 'lucide-react'

const TopStatsGrid = ({
  completionPercentage,
  totalCompleted,
  totalBurned,
  targetTimeline,
}: TopStatsGridProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Streak (Static for now) */}
      <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-none shadow-lg">
        <CardHeader className="pb-2">
          <CardDescription className="text-orange-100 flex items-center gap-2">
            <Flame className="h-4 w-4" /> Current Streak
          </CardDescription>
          <CardTitle className="text-4xl font-bold">5</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-orange-100">days in a row</p>
        </CardContent>
      </Card>

      {/* Completion % */}
      <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-none shadow-lg">
        <CardHeader className="pb-2">
          <CardDescription className="text-blue-100 flex items-center gap-2">
            <Target className="h-4 w-4" /> Completion
          </CardDescription>
          <CardTitle className="text-4xl font-bold">{completionPercentage}%</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-100">of {targetTimeline || 'program'}</p>
        </CardContent>
      </Card>

      {/* Total Workouts */}
      <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white border-none shadow-lg">
        <CardHeader className="pb-2">
          <CardDescription className="text-green-100 flex items-center gap-2">
            <Dumbbell className="h-4 w-4" /> Total Workouts
          </CardDescription>
          <CardTitle className="text-4xl font-bold">{totalCompleted}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-100">completed</p>
        </CardContent>
      </Card>

      {/* Calories Burned */}
      <Card className="bg-gradient-to-br from-amber-400 to-orange-500 text-white border-none shadow-lg">
        <CardHeader className="pb-2">
          <CardDescription className="text-amber-100 flex items-center gap-2">
            <Activity className="h-4 w-4" /> Calories Burned
          </CardDescription>
          <CardTitle className="text-4xl font-bold">
            {totalBurned >= 1000 ? `${(totalBurned / 1000).toFixed(1)}k` : totalBurned}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-amber-100">total calories</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default TopStatsGrid

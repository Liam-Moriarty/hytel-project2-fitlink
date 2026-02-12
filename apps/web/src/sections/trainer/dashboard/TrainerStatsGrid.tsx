import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrainerStatsGridProps } from '@/interface'
import { Activity, Users, Flame, TrendingUp } from 'lucide-react'

const TrainerStatsGrid = ({
  totalClients,
  totalWorkouts,
  successRate,
  totalCalories,
}: TrainerStatsGridProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Active Clients */}
      <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-none shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="pb-2">
          <CardDescription className="text-blue-100 flex items-center gap-2">
            <Users className="h-4 w-4" /> Active Clients
          </CardDescription>
          <CardTitle className="text-4xl font-bold">{totalClients}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-100">trainees assigned</p>
        </CardContent>
      </Card>

      {/* Total Workouts Managed */}
      <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white border-none shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="pb-2">
          <CardDescription className="text-green-100 flex items-center gap-2">
            <Activity className="h-4 w-4" /> Workouts Managed
          </CardDescription>
          <CardTitle className="text-4xl font-bold">{totalWorkouts}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-100">total sessions completed</p>
        </CardContent>
      </Card>

      {/* Client Success Rate */}
      <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-none shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="pb-2">
          <CardDescription className="text-purple-100 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Avg. Success Rate
          </CardDescription>
          <CardTitle className="text-4xl font-bold">{successRate}%</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-purple-100">client goal completion</p>
        </CardContent>
      </Card>

      {/* Total Calories Burned */}
      <Card className="bg-gradient-to-br from-amber-400 to-orange-500 text-white border-none shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="pb-2">
          <CardDescription className="text-amber-100 flex items-center gap-2">
            <Flame className="h-4 w-4" /> Client Burn
          </CardDescription>
          <CardTitle className="text-4xl font-bold">
            {totalCalories >= 1000 ? `${(totalCalories / 1000).toFixed(1)}k` : totalCalories}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-amber-100">total calories burned</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default TrainerStatsGrid

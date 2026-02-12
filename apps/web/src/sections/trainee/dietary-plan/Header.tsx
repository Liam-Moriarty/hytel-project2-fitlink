import { Card, CardContent } from '@/components/ui/card'
import { DietaryHeaderProps } from '@/interface'

const Header = ({
  userData,
  progressPercentage,
  completedCount,
  totalMealDays,
}: DietaryHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Dietary Plan</h1>
        <p className="text-muted-foreground mt-1 capitalize">
          {userData ? userData.traineeGoals.targetTimeline : null} • Daily Nutrition Tracking
        </p>
      </div>

      <Card className="w-full md:w-auto bg-green-500/5 border-green-500/20">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="relative flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                className="text-green-500/20"
                strokeWidth="4"
                stroke="currentColor"
                fill="transparent"
                r="30"
                cx="32"
                cy="32"
              />
              <circle
                className="text-green-500"
                strokeWidth="4"
                strokeDasharray={188}
                strokeDashoffset={188 - (188 * progressPercentage) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="30"
                cx="32"
                cy="32"
              />
            </svg>
            <span className="absolute text-sm font-bold">{progressPercentage}%</span>
          </div>
          <div>
            <p className="text-sm font-medium">Dietary Adherence</p>
            <p className="text-xs text-muted-foreground">
              {completedCount} of {totalMealDays} meal days tracked
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Header

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { UtensilsCrossed, ArrowRight } from 'lucide-react'
import { DietarySummaryCardProps } from '@/interface'

const DietarySummaryCard = ({
  adherencePercentage,
  completedMealDays,
  totalMealDays,
  currentWeekCompleted,
  currentWeekTotal,
  navigate,
}: DietarySummaryCardProps) => {
  const currentWeekPercentage =
    currentWeekTotal > 0 ? Math.round((currentWeekCompleted / currentWeekTotal) * 100) : 0

  return (
    <Card className="border-green-500/20 bg-green-500/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-green-600" />
            <span>Dietary Progress</span>
          </div>
          <span className="text-2xl font-bold text-green-600">{adherencePercentage}%</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Overall Adherence</span>
            <span className="font-medium">
              {completedMealDays}/{totalMealDays} days
            </span>
          </div>
          <Progress value={adherencePercentage} className="h-2" />
        </div>

        {/* Current Week Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">This Week</span>
            <span className="font-medium">
              {currentWeekCompleted}/{currentWeekTotal} days
            </span>
          </div>
          <Progress value={currentWeekPercentage} className="h-2" />
        </div>

        {/* Action Button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate('/dashboard/trainee/dietary-plan')}
        >
          View Dietary Plan
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  )
}

export default DietarySummaryCard

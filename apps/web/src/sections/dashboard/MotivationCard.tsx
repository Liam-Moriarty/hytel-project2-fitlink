import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MotivationCardProps } from '@/interface'
import { CheckCircle2, Trophy } from 'lucide-react'

const MotivationCard = ({
  totalCompleted,
  totalBurned,
  completionPercentage,
}: MotivationCardProps) => {
  return (
    <Card className="shadow-md bg-background border">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-purple-600" />
          Keep Going!
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Consistency is key to reaching your fitness goals. You're doing great!
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span>{totalCompleted} workouts completed</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span>{totalBurned} calories burned</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span>{completionPercentage}% program complete</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MotivationCard

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfileUserProps } from '@/interface'

const AdditionalGoals = ({ user }: ProfileUserProps) => {
  const traineeGoals = user.traineeGoals || {}

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Additional Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {traineeGoals.goals && traineeGoals.goals.length > 0 ? (
            traineeGoals.goals.map((goal: string, i: number) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-primary" />
                {goal}
              </li>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No goals set</p>
          )}
        </ul>
      </CardContent>
    </Card>
  )
}

export default AdditionalGoals

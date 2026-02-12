import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UtensilsCrossed, ChevronRight } from 'lucide-react'
import { TraineeAnalytics } from '@/interface'

interface DietaryProgressSummaryProps {
  clients: TraineeAnalytics[]
  navigate: (path: string) => void
}

const DietaryProgressSummary = ({ clients, navigate }: DietaryProgressSummaryProps) => {
  // Sort clients by dietary adherence (lowest first to identify those needing help)
  const sortedClients = [...clients].sort(
    (a, b) => b.dietaryAdherencePercentage - a.dietaryAdherencePercentage
  )

  return (
    <Card className="shadow-md h-fit flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5 text-primary" />
              Dietary Progress
            </CardTitle>
            <CardDescription>Nutritional adherence status of your trainees</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('analytics')}>
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ScrollArea className="h-[250px] pr-4">
          {sortedClients.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <p className="text-muted-foreground">No active clients found.</p>
              <Button variant="link" onClick={() => navigate('clients')}>
                Invite Clients
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedClients.map(client => (
                <div key={client.userId} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex flex-col">
                      <span className="font-medium">{client.userName}</span>
                      <span className="text-xs text-muted-foreground">
                        {client.totalMealDaysCompleted}/{client.totalMealDays} days • Avg{' '}
                        {client.avgDailyCalories} cal/day
                      </span>
                    </div>
                    <span className="font-bold text-green-600">
                      {client.dietaryAdherencePercentage}%
                    </span>
                  </div>
                  <Progress value={client.dietaryAdherencePercentage} className="h-2" />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default DietaryProgressSummary

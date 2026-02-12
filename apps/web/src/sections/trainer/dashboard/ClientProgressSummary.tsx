import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Target, ChevronRight } from 'lucide-react'
import { TraineeAnalytics } from '@/interface'

interface ClientProgressSummaryProps {
  clients: TraineeAnalytics[]
  navigate: (path: string) => void
}

const ClientProgressSummary = ({ clients, navigate }: ClientProgressSummaryProps) => {
  // Sort clients by progress (lowest first to identify those needing help) or by recent activity
  const sortedClients = [...clients].sort(
    (a, b) => b.totalWorkoutsCompleted - a.totalWorkoutsCompleted
  )

  return (
    <Card className="shadow-md h-fit flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Client Progress
            </CardTitle>
            <CardDescription>Overall completion status of your trainees</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('clients')}>
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
                        Week {client.currentWeek} • {client.totalWorkoutsCompleted} workouts
                      </span>
                    </div>
                    <span className="font-bold">{client.progressPercentage}%</span>
                  </div>
                  <Progress value={client.progressPercentage} className="h-2" />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default ClientProgressSummary

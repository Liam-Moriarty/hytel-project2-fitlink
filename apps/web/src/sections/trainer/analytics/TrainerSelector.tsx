import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TraineeSelectorProps } from '@/interface'

const TraineeSelector = ({ clients, selectedTrainees, onTraineeSelect }: TraineeSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select a Trainee</CardTitle>
        <CardDescription>Choose a trainee to view their analytics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {clients.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No trainees found. Add trainees to get started.
            </p>
          ) : (
            clients.map(client => (
              <Badge
                key={client.uid}
                variant={selectedTrainees.includes(client.uid) ? 'default' : 'outline'}
                className="cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105 capitalize"
                onClick={() => onTraineeSelect(client.uid)}
              >
                {client.displayName || client.email}
                {selectedTrainees.includes(client.uid) && <span className="ml-2 font-bold">✓</span>}
              </Badge>
            ))
          )}
        </div>
        {selectedTrainees.length > 0 && (
          <p className="text-xs text-muted-foreground mt-3">1 trainee selected</p>
        )}
      </CardContent>
    </Card>
  )
}

export default TraineeSelector

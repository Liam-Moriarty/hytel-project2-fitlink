import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ScheduleOverviewProps {
  availability: string[]
  navigate: (path: string) => void
}

const ScheduleOverview = ({ availability, navigate }: ScheduleOverviewProps) => {
  return (
    <Card className="shadow-md h-fit flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Schedule Overview
            </CardTitle>
            <CardDescription>Your current availability</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('schedule')}>
            Manage <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {availability.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[100px] text-center">
            <p className="text-sm text-muted-foreground mb-2">No availability set.</p>
            <Button variant="outline" size="sm" onClick={() => navigate('schedule')}>
              Set Availability
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availability.map(day => (
              <Badge key={day} variant="secondary" className="px-3 py-1 capitalize">
                {day}
              </Badge>
            ))}
          </div>
        )}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Next Steps</h4>
          <p className="text-xs text-muted-foreground">
            Ensure your schedule is up to date to receive new client bookings.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default ScheduleOverview

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Award, Calendar, Users } from 'lucide-react'
import { TrainerOverviewProps } from '@/interface'

const TrainerOverview = ({
  clientCount,
  certificationsCount,
  availableDaysCount,
}: TrainerOverviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Overview</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <div className="flex items-center gap-3 rounded-lg p-4 border">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Clients</p>
            <p className="text-sm font-semibold">{clientCount}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg p-4 border">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-200">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Certifications</p>
            <p className="text-sm font-semibold">{certificationsCount}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg p-4 border">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-800 dark:text-purple-200">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Available Days</p>
            <p className="text-sm font-semibold">{availableDaysCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TrainerOverview

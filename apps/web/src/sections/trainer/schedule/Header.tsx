import { Card, CardContent } from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import { ScheduleHeaderProps } from '@/interface'

const Header = ({ availableDaysCount }: ScheduleHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Schedule</h1>
        <p className="text-muted-foreground mt-1">Manage your availability and certifications</p>
      </div>

      <Card className="w-full md:w-auto bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Available Days</p>
            <p className="text-2xl font-bold">{availableDaysCount}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Header

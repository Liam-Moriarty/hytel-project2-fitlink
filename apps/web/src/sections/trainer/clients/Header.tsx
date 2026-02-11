import { Card, CardContent } from '@/components/ui/card'
import { Users } from 'lucide-react'
import { ClientsHeaderProps } from '@/interface'

const Header = ({ clientCount }: ClientsHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Clients</h1>
        <p className="text-muted-foreground mt-1">Manage and invite your trainees</p>
      </div>

      <Card className="w-full md:w-auto bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Total Clients</p>
            <p className="text-2xl font-bold">{clientCount}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Header

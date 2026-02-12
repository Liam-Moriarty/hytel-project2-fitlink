import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity } from 'lucide-react'

const BodyMeasurements = () => {
  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-600" /> Body Measurements
        </CardTitle>
      </CardHeader>

      <Card className="shadow-md pt-4">
        <CardContent>
          <div className="space-y-6">
            {[
              { date: 'Jan 1', weight: '75 kg', fat: '20%' },
              { date: 'Jan 15', weight: '74 kg', fat: '19.5%' },
              { date: 'Feb 1', weight: '73.5 kg', fat: '19%' },
              { date: 'Feb 15', weight: '73 kg', fat: '18.5%' },
              { date: 'Mar 1', weight: '72.5 kg', fat: '18%' },
              { date: 'Mar 15', weight: '72 kg', fat: '17.5%' },
            ].map((entry, i) => (
              <div
                key={i}
                className="flex justify-between items-center pb-4 border-b last:border-0 last:pb-0"
              >
                <span className="font-medium text-muted-foreground">{entry.date}</span>
                <div className="text-right">
                  <div className="font-bold">{entry.weight}</div>
                  <div className="text-xs text-muted-foreground">Weight</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{entry.fat}</div>
                  <div className="text-xs text-muted-foreground">Body Fat</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default BodyMeasurements

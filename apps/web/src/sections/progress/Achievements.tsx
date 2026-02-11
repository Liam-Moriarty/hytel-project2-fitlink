/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AchievementsProps } from '@/interface'
import { Award } from 'lucide-react'

const Achievements = ({ achievements }: AchievementsProps) => {
  return (
    <Card className="h-full shadow-md border-none bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Award className="h-5 w-5 text-amber-500" /> Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((item, i) => (
            <div
              key={i}
              className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-all hover:shadow-lg ${item.active ? item.bg + ' border-' + item.color.split('-')[1] + '-200' : 'bg-gray-50 border-gray-100 opacity-70'}`}
            >
              <div
                className={`p-3 rounded-full mb-3 ${item.active ? 'bg-white shadow-sm' : 'bg-gray-200'}`}
              >
                <item.icon className={`h-8 w-8 ${item.active ? item.color : 'text-gray-400'}`} />
              </div>
              <h3 className={`font-bold ${item.active ? 'text-gray-900' : 'text-gray-500'}`}>
                {item.title}
              </h3>
              <p className="text-xs text-muted-foreground text-center mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default Achievements

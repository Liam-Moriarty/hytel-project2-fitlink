/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Award, Trophy } from 'lucide-react'
import { AchievementsProps } from '@/interface'

const Achievements = ({ achievements, activeAchievements, navigate }: AchievementsProps) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          Recent Achievements
        </CardTitle>
        <CardDescription>
          {activeAchievements.length} of {achievements.length} unlocked
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {activeAchievements.slice(0, 3).map((item, i) => (
          <div key={i} className={`flex items-center gap-3 p-3 rounded-lg bg-background border`}>
            <div className="p-2 rounded-full bg-white shadow-sm">
              <item.icon className={`h-6 w-6 ${item.color}`} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm">{item.title}</h4>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}

        {activeAchievements.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Complete workouts to unlock achievements!</p>
          </div>
        )}

        <Button
          variant="outline"
          className="w-full mt-2"
          size="sm"
          onClick={() => navigate('progress')}
        >
          View All Achievements
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  )
}

export default Achievements

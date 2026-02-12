/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { CheckCircle2, Circle, Clock, Flame, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'
import { WorkoutTabsProps } from '@/interface'

const WorkoutTabs = ({
  workoutPlan,
  completedWorkouts,
  toggleWorkoutCompletion,
}: WorkoutTabsProps) => {
  return (
    <Tabs defaultValue="week-1" className="w-full">
      <div className="space-y-4 mb-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold">Weekly Workouts</h3>
          <Badge variant="outline" className="text-sm py-1 px-3">
            Focus: {workoutPlan.workoutPlan.find((w: any) => w.weekNumber === 1)?.focus}
          </Badge>
        </div>

        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <TabsList className="inline-flex h-auto w-max p-1 bg-transparent">
            {workoutPlan.workoutPlan.map((week: any) => {
              const isWeekCompleted = week.schedule.every((day: any) =>
                completedWorkouts.has(`${week.weekNumber}-${day.day}`)
              )

              return (
                <TabsTrigger
                  key={week.weekNumber}
                  value={`week-${week.weekNumber}`}
                  className="px-6 py-2 flex items-center gap-2 data-[state=active]:bg-background"
                >
                  Week {week.weekNumber}
                  {isWeekCompleted && <CheckCircle2 className="h-4 w-4 text-primary" />}
                </TabsTrigger>
              )
            })}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {workoutPlan.workoutPlan.map((week: any) => (
        <TabsContent key={week.weekNumber} value={`week-${week.weekNumber}`} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {week.schedule.map((day: any) => {
              const key = `${week.weekNumber}-${day.day}`
              const isCompleted = completedWorkouts.has(key)
              const isRestDay = day.workoutType.toLowerCase().includes('rest')

              return (
                <Card
                  key={day.day}
                  className={cn(
                    'flex flex-col transition-all duration-200 hover:shadow-md',
                    isCompleted ? 'bg-primary/5 border-primary/30' : '',
                    isRestDay ? 'opacity-80 bg-muted/30' : ''
                  )}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge variant={isRestDay ? 'secondary' : 'default'} className="mb-2">
                        Day {day.day}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          'h-8 w-8 rounded-full',
                          isCompleted
                            ? 'text-primary hover:text-primary/80'
                            : 'text-muted-foreground hover:text-primary'
                        )}
                        onClick={() => toggleWorkoutCompletion(week.weekNumber, day.day)}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-6 w-6" />
                        ) : (
                          <Circle className="h-6 w-6" />
                        )}
                      </Button>
                    </div>
                    <CardTitle className="text-xl leading-tight">{day.workoutType}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {day.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 pb-3">
                    {!isRestDay && (
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{day.durationMinutes} min</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Flame className="h-4 w-4" />
                          <span>{day.caloriesBurned} cal</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                          <Activity className="h-4 w-4" />
                          <span>
                            Intensity:{' '}
                            <span className="font-medium text-foreground">{day.intensity}</span>
                          </span>
                        </div>
                      </div>
                    )}
                    {isRestDay && (
                      <div className="flex items-center justify-center h-full min-h-[40px] text-muted-foreground italic">
                        Take it easy today! 🌿
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Button
                      variant={isCompleted ? 'outline' : 'default'}
                      className="w-full"
                      onClick={() => toggleWorkoutCompletion(week.weekNumber, day.day)}
                    >
                      {isCompleted ? 'Completed' : 'Mark Complete'}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default WorkoutTabs

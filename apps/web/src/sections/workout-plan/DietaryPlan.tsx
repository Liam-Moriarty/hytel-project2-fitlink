/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Flame, UtensilsCrossed } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DietaryPlanProps } from '@/interface'

const DietaryPlan = ({ workoutPlan }: DietaryPlanProps) => {
  if (!workoutPlan.dietaryPlan) return null

  return (
    <div className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <UtensilsCrossed className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Your Dietary Plan</h2>
      </div>

      <Tabs defaultValue="diet-week-1" className="w-full">
        <div className="space-y-4 mb-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold">Weekly Meal Plans</h3>
            <Badge variant="outline" className="text-sm py-1 px-3">
              <Flame className="h-3 w-3 mr-1 inline" />
              Daily Goal: {workoutPlan.dietaryPlan?.[0]?.dailyIntakeGoal || 2200} cal
            </Badge>
          </div>

          <ScrollArea className="w-full whitespace-nowrap rounded-md border">
            <TabsList className="inline-flex h-auto w-max p-1 bg-transparent">
              {workoutPlan.dietaryPlan?.map((week: any) => (
                <TabsTrigger
                  key={week.weekNumber}
                  value={`diet-week-${week.weekNumber}`}
                  className="px-6 py-2 flex items-center gap-2 data-[state=active]:bg-background"
                >
                  Week {week.weekNumber}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {workoutPlan.dietaryPlan?.map((week: any) => (
          <TabsContent
            key={week.weekNumber}
            value={`diet-week-${week.weekNumber}`}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {week.days.map((day: any) => (
                <Card
                  key={day.day}
                  className="flex flex-col transition-all duration-200 hover:shadow-md"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge variant="default" className="mb-2">
                        Day {day.day}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Flame className="h-4 w-4" />
                        <span className="font-medium">{day.totalCalories}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-primary mb-1">🌅 Breakfast</p>
                        <p className="text-sm text-muted-foreground">{day.meals.breakfast}</p>
                      </div>

                      <Separator />

                      <div>
                        <p className="text-xs font-semibold text-primary mb-1">☀️ Lunch</p>
                        <p className="text-sm text-muted-foreground">{day.meals.lunch}</p>
                      </div>

                      <Separator />

                      <div>
                        <p className="text-xs font-semibold text-primary mb-1">🌙 Dinner</p>
                        <p className="text-sm text-muted-foreground">{day.meals.dinner}</p>
                      </div>

                      <Separator />

                      <div>
                        <p className="text-xs font-semibold text-primary mb-1">🍎 Snack</p>
                        <p className="text-sm text-muted-foreground">{day.meals.snack}</p>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
                      <span>Target: {week.dailyIntakeGoal} cal</span>
                      <span
                        className={cn(
                          'font-semibold',
                          day.totalCalories > week.dailyIntakeGoal
                            ? 'text-orange-500'
                            : 'text-green-500'
                        )}
                      >
                        {day.totalCalories > week.dailyIntakeGoal ? '+' : ''}
                        {day.totalCalories - week.dailyIntakeGoal} cal
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default DietaryPlan

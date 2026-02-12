/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { CheckCircle2, Circle, Flame, UtensilsCrossed } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MealPlanTabsProps } from '@/interface'

const MealPlanTabs = ({ workoutPlan, completedMeals, toggleMealCompletion }: MealPlanTabsProps) => {
  if (!workoutPlan.dietaryPlan) return null

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <UtensilsCrossed className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Weekly Meal Plans</h2>
      </div>

      <Tabs defaultValue="diet-week-1" className="w-full">
        <div className="space-y-4 mb-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold">Select a Week</h3>
            <Badge variant="outline" className="text-sm py-1 px-3">
              <Flame className="h-3 w-3 mr-1 inline" />
              Daily Goal: {workoutPlan.dietaryPlan?.[0]?.dailyIntakeGoal || 2200} cal
            </Badge>
          </div>

          <ScrollArea className="w-full whitespace-nowrap rounded-md border">
            <TabsList className="inline-flex h-auto w-max p-1 bg-transparent">
              {workoutPlan.dietaryPlan?.map((week: any) => {
                const isWeekCompleted = week.days.every((day: any) =>
                  completedMeals.has(`${week.weekNumber}-${day.day}`)
                )

                return (
                  <TabsTrigger
                    key={week.weekNumber}
                    value={`diet-week-${week.weekNumber}`}
                    className="px-6 py-2 flex items-center gap-2 data-[state=active]:bg-background"
                  >
                    Week {week.weekNumber}
                    {isWeekCompleted && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  </TabsTrigger>
                )
              })}
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
              {week.days.map((day: any) => {
                const key = `${week.weekNumber}-${day.day}`
                const isCompleted = completedMeals.has(key)

                return (
                  <Card
                    key={day.day}
                    className={cn(
                      'flex flex-col transition-all duration-200 hover:shadow-md',
                      isCompleted ? 'bg-green-500/5 border-green-500/30' : ''
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge variant="default" className="mb-2">
                          Day {day.day}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Flame className="h-4 w-4" />
                            <span className="font-medium">{day.totalCalories}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              'h-8 w-8 rounded-full',
                              isCompleted
                                ? 'text-green-500 hover:text-green-500/80'
                                : 'text-muted-foreground hover:text-green-500'
                            )}
                            onClick={() => toggleMealCompletion(week.weekNumber, day.day)}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-6 w-6" />
                            ) : (
                              <Circle className="h-6 w-6" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 space-y-4">
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-semibold text-primary mb-1">Breakfast</p>
                          <p className="text-sm text-muted-foreground">{day.meals.breakfast}</p>
                        </div>
                        <Separator />
                        <div>
                          <p className="text-xs font-semibold text-primary mb-1">Lunch</p>
                          <p className="text-sm text-muted-foreground">{day.meals.lunch}</p>
                        </div>
                        <Separator />
                        <div>
                          <p className="text-xs font-semibold text-primary mb-1">Dinner</p>
                          <p className="text-sm text-muted-foreground">{day.meals.dinner}</p>
                        </div>
                        <Separator />
                        <div>
                          <p className="text-xs font-semibold text-primary mb-1">Snack</p>
                          <p className="text-sm text-muted-foreground">{day.meals.snack}</p>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-0 flex flex-col gap-2">
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
                      <Button
                        variant={isCompleted ? 'outline' : 'default'}
                        className="w-full"
                        onClick={() => toggleMealCompletion(week.weekNumber, day.day)}
                      >
                        {isCompleted ? 'Completed' : 'Mark Day Complete'}
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default MealPlanTabs

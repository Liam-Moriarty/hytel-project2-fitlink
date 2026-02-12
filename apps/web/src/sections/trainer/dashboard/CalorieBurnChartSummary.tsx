import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts'
import { Activity } from 'lucide-react'
import { CalorieBurnChartSummaryProps, AnalyticsChartData } from '@/interface'
import TraineeSelector from '@/sections/trainer/analytics/TrainerSelector'

const CHART_COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))']

const CalorieBurnChartSummary = ({ clients, analyticsData }: CalorieBurnChartSummaryProps) => {
  const [selectedTrainees, setSelectedTrainees] = useState<string[]>([])

  const handleTraineeSelect = (traineeId: string) => {
    setSelectedTrainees(prev => (prev.includes(traineeId) ? [] : [traineeId]))
  }

  // Filter analytics data for selected trainees
  const selectedAnalytics = useMemo(() => {
    return analyticsData.filter(t => selectedTrainees.includes(t.userId))
  }, [analyticsData, selectedTrainees])

  // Transform analytics data into chart format (same logic as Analytics page)
  const chartData: AnalyticsChartData[] = useMemo(() => {
    if (selectedAnalytics.length === 0) return []

    const maxWeek = Math.max(...selectedAnalytics.map(d => d.currentWeek))

    const weeks: AnalyticsChartData[] = []
    for (let week = 1; week <= maxWeek; week++) {
      const weekData: AnalyticsChartData = { week }

      selectedAnalytics.forEach(trainee => {
        const weekCalories = trainee.weeklyCalories.find(w => w.weekNumber === week)
        weekData[trainee.userId] = weekCalories?.caloriesBurned || 0
      })

      weeks.push(weekData)
    }

    return weeks
  }, [selectedAnalytics])

  // Chart configuration (same logic as Analytics page)
  const chartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {}
    selectedAnalytics.forEach((trainee, index) => {
      config[trainee.userId] = {
        label: trainee.userName,
        color: CHART_COLORS[index] || 'hsl(var(--primary))',
      }
    })
    return config
  }, [selectedAnalytics])

  return (
    <div className="space-y-6">
      <TraineeSelector
        clients={clients}
        selectedTrainees={selectedTrainees}
        onTraineeSelect={handleTraineeSelect}
      />

      {selectedTrainees.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-[300px] text-center space-y-4">
            <Activity className="h-16 w-16 text-muted-foreground/50" />
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No Trainees Selected</h3>
              <p className="text-muted-foreground max-w-md">
                Select a trainee from the list above to view their calorie burn progress
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Weekly Calorie Burn Progress</CardTitle>
            <CardDescription>Track calorie burn progress week by week</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="week"
                    tickFormatter={value => `Week ${value}`}
                    className="text-sm"
                  />
                  <YAxis
                    label={{ value: 'Calories Burned', angle: -90, position: 'insideLeft' }}
                    className="text-sm"
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={value => `Week ${value}`}
                        formatter={(value, name) => [
                          `${value} cal`,
                          chartConfig[name as string]?.label || name,
                        ]}
                      />
                    }
                  />
                  <Legend
                    formatter={value => chartConfig[value]?.label || value}
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                  {selectedAnalytics.map((trainee, index) => (
                    <Line
                      key={trainee.userId}
                      type="monotone"
                      dataKey={trainee.userId}
                      stroke={CHART_COLORS[index]}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name={trainee.userName}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default CalorieBurnChartSummary

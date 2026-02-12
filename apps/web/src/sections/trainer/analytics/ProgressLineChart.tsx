import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Activity } from 'lucide-react'
import { ProgressLineChartProps } from '@/interface'

const CHART_COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))']
const DIETARY_COLORS = ['hsl(var(--chart-3))', 'hsl(var(--chart-4))']

const ProgressLineChart = ({
  selectedTrainees,
  chartData,
  dietaryChartData,
  analyticsData,
  chartConfig,
  dietaryChartConfig,
}: ProgressLineChartProps) => {
  if (selectedTrainees.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-[400px] text-center space-y-4">
          <Activity className="h-16 w-16 text-muted-foreground/50" />
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">No Trainees Selected</h3>
            <p className="text-muted-foreground max-w-md">
              Select a trainee from the list above to view their progress
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Calorie Burn Chart */}
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
                {analyticsData.map((trainee, index) => (
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

      {/* Dietary Adherence Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Dietary Adherence Progress</CardTitle>
          <CardDescription>Track dietary adherence progress week by week</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={dietaryChartConfig} className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dietaryChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="week"
                  tickFormatter={value => `Week ${value}`}
                  className="text-sm"
                />
                <YAxis
                  label={{ value: 'Adherence %', angle: -90, position: 'insideLeft' }}
                  className="text-sm"
                  domain={[0, 100]}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={value => `Week ${value}`}
                      formatter={(value, name) => [
                        `${value}%`,
                        dietaryChartConfig[name as string]?.label || name,
                      ]}
                    />
                  }
                />
                <Legend
                  formatter={value => dietaryChartConfig[value]?.label || value}
                  wrapperStyle={{ paddingTop: '20px' }}
                />
                {analyticsData.map((trainee, index) => (
                  <Bar
                    key={`dietary-${trainee.userId}`}
                    dataKey={`dietary-${trainee.userId}`}
                    fill={DIETARY_COLORS[index]}
                    radius={[4, 4, 0, 0]}
                    name={trainee.userName}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProgressLineChart

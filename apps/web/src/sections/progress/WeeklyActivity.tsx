import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { WeeklyActivityProps } from '@/interface'

const WeeklyActivity = ({
  weeklyProgress,
  currentPage,
  totalPages,
  currentWeeks,
  startIndex,
  totalCompleted,
  handlePrevPage,
  handleNextPage,
  itemsPerPage,
}: WeeklyActivityProps) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" /> Weekly Activity
          </CardTitle>
          <div className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {currentWeeks.map(week => (
          <div
            key={week.weekNumber}
            className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-300"
          >
            <div className="flex justify-between text-sm">
              <span className="font-medium text-muted-foreground">{week.week}</span>
              <span className="text-muted-foreground">{week.completed} workouts</span>
            </div>
            <Progress value={week.percentage} className="h-2" />
          </div>
        ))}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center pt-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-xs text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, weeklyProgress.length)}{' '}
              of {weeklyProgress.length}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">Average per week</div>
          <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
            {(totalCompleted / (weeklyProgress.length || 1)).toFixed(1)} workouts
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default WeeklyActivity

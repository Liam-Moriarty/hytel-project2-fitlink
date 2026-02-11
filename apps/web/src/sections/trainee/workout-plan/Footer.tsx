import { Separator } from '@/components/ui/separator'
import { Trophy } from 'lucide-react'
import { FooterProps } from '@/interface'

const Footer = ({ userData }: FooterProps) => {
  return (
    <>
      <Separator />
      <div className="flex flex-col items-center justify-center p-6 text-center space-y-2 bg-muted/20 rounded-lg">
        <Trophy className="h-8 w-8 text-primary mb-2" />
        <h3 className="text-lg font-semibold">Keep Pushing!</h3>
        <p className="text-muted-foreground max-w-md">
          Your target timeline for this program is{' '}
          <span className="font-bold text-foreground capitalize">
            {userData ? userData.traineeGoals.targetTimeline : null}
          </span>
          . Stay consistent and track your progress daily to reach your fitness goals!
        </p>
      </div>
    </>
  )
}

export default Footer

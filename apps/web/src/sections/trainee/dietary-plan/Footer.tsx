import { Separator } from '@/components/ui/separator'
import { UtensilsCrossed } from 'lucide-react'
import { DietaryFooterProps } from '@/interface'

const Footer = ({ userData }: DietaryFooterProps) => {
  return (
    <>
      <Separator />
      <div className="flex flex-col items-center justify-center p-6 text-center space-y-2 bg-muted/20 rounded-lg">
        <UtensilsCrossed className="h-8 w-8 text-green-500 mb-2" />
        <h3 className="text-lg font-semibold">Eat Smart, Train Hard!</h3>
        <p className="text-muted-foreground max-w-md">
          Your dietary plan runs for{' '}
          <span className="font-bold text-foreground capitalize">
            {userData ? userData.traineeGoals.targetTimeline : null}
          </span>
          . Track your daily meals consistently to fuel your fitness journey and see real results!
        </p>
      </div>
    </>
  )
}

export default Footer

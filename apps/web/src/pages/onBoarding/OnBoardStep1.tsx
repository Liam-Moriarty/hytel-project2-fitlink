import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Role } from './types'
import { cn } from '@/lib/utils'
import { Dumbbell, User } from 'lucide-react'

interface OnBoardStep1Props {
  role: Role
  setRole: (role: Role) => void
}

const OnBoardStep1 = ({ role, setRole }: OnBoardStep1Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <Card
        className={cn(
          'cursor-pointer hover:border-primary transition-all',
          role === 'trainee' ? 'border-primary border-2 bg-primary/5' : ''
        )}
        onClick={() => setRole('trainee')}
      >
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-2">
            <User className="w-8 h-8 text-primary" />
          </div>
          <CardTitle>I am a Trainee</CardTitle>
          <CardDescription>
            I want to track my workouts and achieve my fitness goals.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card
        className={cn(
          'cursor-pointer hover:border-primary transition-all',
          role === 'trainer' ? 'border-primary border-2 bg-primary/5' : ''
        )}
        onClick={() => setRole('trainer')}
      >
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-2">
            <Dumbbell className="w-8 h-8 text-primary" />
          </div>
          <CardTitle>I am a Trainer</CardTitle>
          <CardDescription>I want to create plans and manage my trainees.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}

export default OnBoardStep1

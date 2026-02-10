import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Role, OnboardingFormData } from './types'

interface OnBoardStep3Props {
  role: Role
  formData: OnboardingFormData
  toggleSelection: (field: keyof OnboardingFormData, value: string) => void
}

const OnBoardStep3 = ({ role, formData, toggleSelection }: OnBoardStep3Props) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">
        {role === 'trainee' ? 'What are your goals?' : 'What are your specialties?'}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(role === 'trainee'
          ? ['Weight Loss', 'Muscle Gain', 'Endurance', 'Flexibility', 'General Health']
          : ['Weight Loss', 'Strength Training', 'Yoga', 'HIIT', 'Rehabilitation']
        ).map(item => (
          <div
            key={item}
            className={cn(
              'p-4 rounded-lg border cursor-pointer flex items-center justify-between hover:border-primary transition-all',
              (role === 'trainee' ? formData.goals : formData.specialties).includes(item)
                ? 'border-primary bg-primary/5'
                : ''
            )}
            onClick={() => toggleSelection(role === 'trainee' ? 'goals' : 'specialties', item)}
          >
            <span className="font-medium">{item}</span>
            {(role === 'trainee' ? formData.goals : formData.specialties).includes(item) && (
              <Check className="w-4 h-4 text-primary" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default OnBoardStep3

import { Label } from '@/components/ui/label'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Role, OnboardingFormData } from './types'

interface OnBoardStep4Props {
  role: Role
  formData: OnboardingFormData
  toggleSelection: (field: keyof OnboardingFormData, value: string) => void
}

const OnBoardStep4 = ({ role, formData, toggleSelection }: OnBoardStep4Props) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">
        {role === 'trainee' ? 'Preferred Workouts' : 'Certifications'}
      </h3>

      {role === 'trainee' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {['Running', 'Cycling', 'Swimming', 'Weightlifting', 'Yoga', 'Pilates', 'HIIT'].map(
            item => (
              <div
                key={item}
                className={cn(
                  'p-4 rounded-lg border cursor-pointer flex items-center justify-between hover:border-primary transition-all',
                  formData.preferredWorkoutTypes.includes(item) ? 'border-primary bg-primary/5' : ''
                )}
                onClick={() => toggleSelection('preferredWorkoutTypes', item)}
              >
                <span className="font-medium">{item}</span>
                {formData.preferredWorkoutTypes.includes(item) && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </div>
            )
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <Label>Add your certifications (Select or Type)</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {['ACE', 'NASM', 'ISSA', 'ACSM', 'CrossFit Level 1'].map(item => (
              <div
                key={item}
                className={cn(
                  'p-4 rounded-lg border cursor-pointer flex items-center justify-between hover:border-primary transition-all',
                  formData.certifications.includes(item) ? 'border-primary bg-primary/5' : ''
                )}
                onClick={() => toggleSelection('certifications', item)}
              >
                <span className="font-medium">{item}</span>
                {formData.certifications.includes(item) && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default OnBoardStep4

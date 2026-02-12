import { FormField, FormItem, FormControl, FormMessage, FormLabel } from '@/components/ui/form'
import { OnboardingFormValues } from './schemas'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Path, ControllerRenderProps } from 'react-hook-form'
import { OnBoardStepProps } from '@/interface'
import { certifications, workoutTypes } from '@/constants'

const OnBoardStep4 = ({ role, form }: OnBoardStepProps) => {
  const fieldName = (
    role === 'trainee' ? 'preferredWorkoutTypes' : 'certifications'
  ) as Path<OnboardingFormValues>
  const items = role === 'trainee' ? workoutTypes : certifications

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">
        {role === 'trainee' ? 'Preferred Workouts' : 'Certifications'}
      </h3>

      <FormField
        control={form.control}
        name={fieldName}
        render={() => (
          <FormItem>
            {role === 'trainer' && <FormLabel>Add your certifications (Select or Type)</FormLabel>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {items.map(item => (
                <FormField
                  key={item}
                  control={form.control}
                  name={fieldName}
                  render={({ field }: { field: ControllerRenderProps<OnboardingFormValues> }) => {
                    return (
                      <FormItem
                        key={item}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <div
                            className={cn(
                              'w-full p-4 rounded-lg border cursor-pointer flex items-center justify-between hover:border-primary transition-all',
                              field.value?.includes(item) ? 'border-primary bg-primary/5' : ''
                            )}
                            onClick={() => {
                              const value = (field.value as string[]) || []
                              if (value.includes(item)) {
                                field.onChange(value.filter((val: string) => val !== item))
                              } else {
                                field.onChange([...value, item])
                              }
                            }}
                          >
                            <span className="font-medium">{item}</span>
                            {field.value?.includes(item) && (
                              <Check className="w-4 h-4 text-primary" />
                            )}
                          </div>
                        </FormControl>
                      </FormItem>
                    )
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export default OnBoardStep4

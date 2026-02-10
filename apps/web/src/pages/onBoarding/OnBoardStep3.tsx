import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import { UseFormReturn } from 'react-hook-form'
import { OnboardingFormValues } from './schemas'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Role } from './types'
import { Path, ControllerRenderProps } from 'react-hook-form'

interface OnBoardStep3Props {
  role: Role
  form: UseFormReturn<OnboardingFormValues>
}

const OnBoardStep3 = ({ role, form }: OnBoardStep3Props) => {
  const items =
    role === 'trainee'
      ? ['Weight Loss', 'Muscle Gain', 'Endurance', 'Flexibility', 'General Health']
      : ['Weight Loss', 'Strength Training', 'Yoga', 'HIIT', 'Rehabilitation']

  const fieldName = (role === 'trainee' ? 'goals' : 'specialties') as Path<OnboardingFormValues>

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">
        {role === 'trainee' ? 'What are your goals?' : 'What are your specialties?'}
      </h3>
      <FormField
        control={form.control}
        name={fieldName}
        render={() => (
          <FormItem>
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

export default OnBoardStep3

import { FormField, FormItem, FormControl, FormMessage, FormLabel } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { OnBoardStepProps } from '@/interface'
import { frequencyOptions, timelineOptions } from '@/constants'

const OnBoardStep5 = ({ role, form }: OnBoardStepProps) => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return (
    <div className="mt-6 space-y-6">
      <h3 className="text-lg font-medium mb-4">
        {role === 'trainee' ? 'Final Details' : 'Availability'}
      </h3>

      {role === 'trainee' && (
        <>
          <FormField
            control={form.control}
            name="frequencyPerWeek"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How many days per week can you workout?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {frequencyOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="targetTimeline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What is your target timeline?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timelineOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}

      {role === 'trainer' && (
        <FormField
          control={form.control}
          name="availability"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Select your available days</FormLabel>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {daysOfWeek.map(day => (
                  <FormField
                    key={day}
                    control={form.control}
                    name="availability"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={day}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(day)}
                              onCheckedChange={checked => {
                                return checked
                                  ? field.onChange([...(field.value || []), day])
                                  : field.onChange(
                                      field.value?.filter((value: string) => value !== day)
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{day}</FormLabel>
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
      )}
    </div>
  )
}

export default OnBoardStep5

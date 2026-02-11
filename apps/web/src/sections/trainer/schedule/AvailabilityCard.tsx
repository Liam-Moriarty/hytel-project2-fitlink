import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CalendarDays, Edit, Loader2 } from 'lucide-react'
import { daysOfWeek } from '@/constants'
import { updateTrainerProfile } from '@/lib/api/trainer'
import { availabilitySchema, AvailabilityFormValues } from '@/lib/schemas/trainer'
import { AvailabilityCardProps } from '@/interface'

const AvailabilityCard = ({ trainerId, availability }: AvailabilityCardProps) => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<AvailabilityFormValues>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      availability: availability,
    },
  })

  const mutation = useMutation({
    mutationFn: (values: AvailabilityFormValues) =>
      updateTrainerProfile(trainerId, { availability: values.availability }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainerProfile', trainerId] })
      toast.success('Availability updated successfully')
      setOpen(false)
    },
    onError: error => {
      toast.error('Failed to update availability')
      console.error(error)
    },
  })

  const onSubmit = (values: AvailabilityFormValues) => {
    mutation.mutate(values)
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      form.reset({ availability })
    }
    setOpen(isOpen)
  }

  const sortedAvailability = [...availability].sort(
    (a, b) => daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b)
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CalendarDays className="w-5 h-5 text-primary" />
          Availability
        </CardTitle>
        <Sheet open={open} onOpenChange={handleOpenChange}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Edit Availability</SheetTitle>
              <SheetDescription>
                Select the days you are available for training sessions.
              </SheetDescription>
            </SheetHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
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
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(day)}
                                    onCheckedChange={checked => {
                                      return checked
                                        ? field.onChange([...(field.value || []), day])
                                        : field.onChange(
                                            field.value?.filter(value => value !== day)
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{day}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      </CardHeader>
      <CardContent>
        {sortedAvailability.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {sortedAvailability.map(day => (
              <Badge key={day} variant="secondary">
                {day}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            No availability set. Click Edit to add your available days.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default AvailabilityCard

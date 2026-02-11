import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { Zap, Edit, Loader2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { updateTrainerProfile } from '@/lib/api/trainer'
import { specialtiesSchema, SpecialtiesFormValues } from '@/lib/schemas/trainer'
import { TrainerSpecialtiesProps } from '@/interface'

const predefinedSpecialties = ['Weight Loss', 'Strength Training', 'Yoga', 'HIIT', 'Rehabilitation']

const Specialties = ({ trainerId, specialties }: TrainerSpecialtiesProps) => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<SpecialtiesFormValues>({
    resolver: zodResolver(specialtiesSchema),
    defaultValues: {
      specialties: specialties,
    },
  })

  const mutation = useMutation({
    mutationFn: (values: SpecialtiesFormValues) =>
      updateTrainerProfile(trainerId, { specialties: values.specialties }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainerProfile', trainerId] })
      toast.success('Specialties updated successfully')
      setOpen(false)
    },
    onError: error => {
      toast.error('Failed to update specialties')
      console.error(error)
    },
  })

  const onSubmit = (values: SpecialtiesFormValues) => {
    mutation.mutate(values)
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      form.reset({ specialties })
    }
    setOpen(isOpen)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="w-5 h-5 text-primary" />
          Specialties
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
              <SheetTitle>Edit Specialties</SheetTitle>
              <SheetDescription>Select the areas you specialize in as a trainer.</SheetDescription>
            </SheetHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
                <FormField
                  control={form.control}
                  name="specialties"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-base">Select your specialties</FormLabel>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        {predefinedSpecialties.map(specialty => (
                          <FormField
                            key={specialty}
                            control={form.control}
                            name="specialties"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <div
                                    className={cn(
                                      'w-full p-4 rounded-lg border cursor-pointer flex items-center justify-between hover:border-primary transition-all',
                                      field.value?.includes(specialty)
                                        ? 'border-primary bg-primary/5'
                                        : ''
                                    )}
                                    onClick={() => {
                                      const value = (field.value as string[]) || []
                                      if (value.includes(specialty)) {
                                        field.onChange(
                                          value.filter((val: string) => val !== specialty)
                                        )
                                      } else {
                                        field.onChange([...value, specialty])
                                      }
                                    }}
                                  >
                                    <span className="font-medium">{specialty}</span>
                                    {field.value?.includes(specialty) && (
                                      <Check className="w-4 h-4 text-primary" />
                                    )}
                                  </div>
                                </FormControl>
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
        {specialties.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {specialties.map(specialty => (
              <Badge key={specialty} variant="secondary" className="px-3 py-1">
                {specialty}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            No specialties set. Click Edit to add your specialties.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default Specialties

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUpdateUser } from '@/hooks/useUser'
import { toast } from 'sonner'
import { Bell, Edit, Settings } from 'lucide-react'
import { trainerPersonalInfoSchema, TrainerPersonalInfoValues } from '@/lib/schemas/trainer'
import { TrainerSettingsCardProps } from '@/interface'

const SettingsCard = ({ user }: TrainerSettingsCardProps) => {
  const [open, setOpen] = useState(false)

  const form = useForm<TrainerPersonalInfoValues>({
    resolver: zodResolver(trainerPersonalInfoSchema),
    defaultValues: {
      age: user.age?.toString() || '',
      gender: (user.gender as 'male' | 'female' | 'other') || 'male',
      height: user.height?.toString() || '',
      weight: user.weight?.toString() || '',
      activityLevel:
        (user.activityLevel as 'sedentary' | 'light' | 'moderate' | 'high') || 'moderate',
    },
  })

  const mutation = useUpdateUser(user.uid)

  const onSubmit = (values: TrainerPersonalInfoValues) => {
    mutation.mutate(
      {
        age: parseInt(values.age),
        gender: values.gender,
        height: parseInt(values.height),
        weight: parseInt(values.weight),
        activityLevel: values.activityLevel,
      },
      {
        onSuccess: () => {
          toast.success('Profile updated successfully')
          setOpen(false)
        },
        onError: error => {
          toast.error('Failed to update profile')
          console.error(error)
        },
      }
    )
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      form.reset({
        age: user.age?.toString() || '',
        gender: (user.gender as 'male' | 'female' | 'other') || 'male',
        height: user.height?.toString() || '',
        weight: user.weight?.toString() || '',
        activityLevel:
          (user.activityLevel as 'sedentary' | 'light' | 'moderate' | 'high') || 'moderate',
      })
    }
    setOpen(isOpen)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">Notifications</p>
            <p className="text-xs text-muted-foreground">Manage alerts and reminders</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">App Settings</p>
            <p className="text-xs text-muted-foreground">Customize your experience</p>
          </div>
        </div>

        <div className="pt-2">
          <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Edit className="h-4 w-4" />
                Edit Personal Info
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Edit Personal Info</SheetTitle>
                <SheetDescription>
                  Update your personal information. Click save when you're done.
                </SheetDescription>
              </SheetHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                              <Input placeholder="25" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height (cm)</FormLabel>
                            <FormControl>
                              <Input placeholder="175" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight (kg)</FormLabel>
                            <FormControl>
                              <Input placeholder="70" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="activityLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Activity Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select activity level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sedentary">Sedentary</SelectItem>
                              <SelectItem value="light">Lightly Active</SelectItem>
                              <SelectItem value="moderate">Moderately Active</SelectItem>
                              <SelectItem value="high">Highly Active</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </Form>
            </SheetContent>
          </Sheet>
        </div>
      </CardContent>
    </Card>
  )
}

export default SettingsCard

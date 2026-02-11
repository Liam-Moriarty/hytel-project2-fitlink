import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { inviteEmailSchema, InviteEmailValues } from '@/lib/schemas/trainer'
import { getUserByEmail, addTraineeToTrainer } from '@/lib/api/trainer'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { UserPlus, Loader2 } from 'lucide-react'
import { InviteCardProps } from '@/interface'

const InviteCard = ({ trainerId, existingTraineeIds }: InviteCardProps) => {
  const queryClient = useQueryClient()
  const [isSearching, setIsSearching] = useState(false)

  const form = useForm<InviteEmailValues>({
    resolver: zodResolver(inviteEmailSchema),
    defaultValues: { email: '' },
  })

  const { mutate: inviteTrainee, isPending } = useMutation({
    mutationFn: async (email: string) => {
      setIsSearching(true)
      const { user, exists } = await getUserByEmail(email)
      setIsSearching(false)

      if (!exists) {
        throw new Error(
          'This email is not registered. Please check the email address or ask the user to sign up first.'
        )
      }

      if (!user) {
        throw new Error(
          'This user is not a trainee. Only users with a trainee role can be added as clients.'
        )
      }

      if (existingTraineeIds.includes(user.uid)) {
        throw new Error('This trainee is already in your client list.')
      }

      await addTraineeToTrainer(trainerId, user.uid)
      return user.displayName || user.email
    },
    onSuccess: name => {
      toast.success(`${name} has been added to your clients`)
      form.clearErrors()
      form.reset()
      queryClient.invalidateQueries({ queryKey: ['trainerProfile', trainerId] })
      queryClient.invalidateQueries({ queryKey: ['trainerClients'] })
    },
    onError: (error: Error) => {
      form.setError('email', { message: error.message })
    },
  })

  const onSubmit = (data: InviteEmailValues) => {
    inviteTrainee(data.email)
  }

  const isLoading = isPending || isSearching

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <UserPlus className="w-5 h-5 text-primary" />
          Invite a Trainee
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="Enter trainee's email address"
                      type="email"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Invite'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default InviteCard

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Award, Edit, Loader2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { certifications as predefinedCertifications } from '@/constants'
import { updateTrainerProfile } from '@/lib/api/trainer'
import { certificationsSchema, CertificationsFormValues } from '@/lib/schemas/trainer'
import { CertificationsCardProps } from '@/interface'

const CertificationsCard = ({ trainerId, certifications }: CertificationsCardProps) => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<CertificationsFormValues>({
    resolver: zodResolver(certificationsSchema),
    defaultValues: {
      certifications: certifications,
    },
  })

  const mutation = useMutation({
    mutationFn: (values: CertificationsFormValues) =>
      updateTrainerProfile(trainerId, { certifications: values.certifications }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainerProfile', trainerId] })
      toast.success('Certifications updated successfully')
      setOpen(false)
    },
    onError: error => {
      toast.error('Failed to update certifications')
      console.error(error)
    },
  })

  const onSubmit = (values: CertificationsFormValues) => {
    mutation.mutate(values)
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      form.reset({ certifications })
    }
    setOpen(isOpen)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Award className="w-5 h-5 text-primary" />
          Certifications
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
              <SheetTitle>Edit Certifications</SheetTitle>
              <SheetDescription>Select your certifications or add custom ones.</SheetDescription>
            </SheetHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
                <FormField
                  control={form.control}
                  name="certifications"
                  render={() => (
                    <FormItem>
                      <Label className="text-base">Select or add your certifications</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        {predefinedCertifications.map(cert => (
                          <FormField
                            key={cert}
                            control={form.control}
                            name="certifications"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <div
                                    className={cn(
                                      'w-full p-4 rounded-lg border cursor-pointer flex items-center justify-between hover:border-primary transition-all',
                                      field.value?.includes(cert)
                                        ? 'border-primary bg-primary/5'
                                        : ''
                                    )}
                                    onClick={() => {
                                      const value = (field.value as string[]) || []
                                      if (value.includes(cert)) {
                                        field.onChange(value.filter((val: string) => val !== cert))
                                      } else {
                                        field.onChange([...value, cert])
                                      }
                                    }}
                                  >
                                    <span className="font-medium">{cert}</span>
                                    {field.value?.includes(cert) && (
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
        {certifications.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {certifications.map(cert => (
              <Badge key={cert} variant="secondary">
                {cert}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            No certifications added. Click Edit to add your certifications.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default CertificationsCard

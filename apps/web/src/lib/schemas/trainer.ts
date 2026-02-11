import { z } from 'zod'

export const inviteEmailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export type InviteEmailValues = z.infer<typeof inviteEmailSchema>

export const availabilitySchema = z.object({
  availability: z.array(z.string()).min(1, 'Please select at least one day'),
})

export type AvailabilityFormValues = z.infer<typeof availabilitySchema>

export const certificationsSchema = z.object({
  certifications: z.array(z.string()).min(1, 'Please add at least one certification'),
})

export type CertificationsFormValues = z.infer<typeof certificationsSchema>

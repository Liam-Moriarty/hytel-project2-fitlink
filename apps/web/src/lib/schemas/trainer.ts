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

export const trainerPersonalInfoSchema = z.object({
  age: z.string().min(1, 'Age is required'),
  gender: z.enum(['male', 'female', 'other']),
  height: z.string().min(1, 'Height is required'),
  weight: z.string().min(1, 'Weight is required'),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'high']),
})

export type TrainerPersonalInfoValues = z.infer<typeof trainerPersonalInfoSchema>

export const specialtiesSchema = z.object({
  specialties: z.array(z.string()).min(1, 'Please select at least one specialty'),
})

export type SpecialtiesFormValues = z.infer<typeof specialtiesSchema>

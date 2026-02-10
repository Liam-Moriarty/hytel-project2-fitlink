import { z } from 'zod'

export const roleSchema = z.object({
  role: z.enum(['trainee', 'trainer'], {
    required_error: 'Please select a role',
  }),
})

export const userDetailsSchema = z.object({
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Please select your gender',
  }),
  age: z.coerce.number().min(1, 'Age must be at least 1').max(120, 'Age must be realistic'),
  height: z.coerce.number().min(1, 'Height must be valid'),
  weight: z.coerce.number().min(1, 'Weight must be valid'),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'high'], {
    required_error: 'Please select your activity level',
  }),
})

// Trainee Goals
export const traineeGoalsSchema = z.object({
  goals: z.array(z.string()).min(1, 'Please select at least one goal'),
})

export const trainerSpecialtiesSchema = z.object({
  specialties: z.array(z.string()).min(1, 'Please select at least one specialty'),
})

// Step 4
export const traineeWorkoutSchema = z.object({
  preferredWorkoutTypes: z.array(z.string()).min(1, 'Please select at least one workout type'),
  // frequencyPerWeek: z.coerce.number().min(1).max(7),
})

export const trainerCertificationsSchema = z.object({
  certifications: z.array(z.string()).min(1, 'Please add at least one certification'),
  // experience: ...
})

export type RoleFormValues = z.infer<typeof roleSchema>
export type UserDetailsFormValues = z.infer<typeof userDetailsSchema>
export type TraineeGoalsFormValues = z.infer<typeof traineeGoalsSchema>
export type TrainerSpecialtiesFormValues = z.infer<typeof trainerSpecialtiesSchema>
export type TraineeWorkoutFormValues = z.infer<typeof traineeWorkoutSchema>
export type TrainerCertificationsFormValues = z.infer<typeof trainerCertificationsSchema>

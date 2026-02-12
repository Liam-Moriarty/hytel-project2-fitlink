import { z } from 'zod'

export const onboardingSchema = z.object({
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Please select a gender' }),
  }),
  age: z
    .string()
    .min(1, 'Age is required')
    .refine(val => !isNaN(Number(val)) && Number(val) >= 18, {
      message: 'You must be at least 18 years old',
    }),
  height: z
    .string()
    .min(1, 'Height is required')
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Please enter a valid height',
    }),
  weight: z
    .string()
    .min(1, 'Weight is required')
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Please enter a valid weight',
    }),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'high'], {
    errorMap: () => ({ message: 'Please select an activity level' }),
  }),
  goals: z.array(z.string()),
  specialties: z.array(z.string()),
  preferredWorkoutTypes: z.array(z.string()),
  certifications: z.array(z.string()),
  frequencyPerWeek: z.string(),
  targetTimeline: z.string(),
  availability: z.array(z.string()),
})

export type OnboardingFormValues = z.infer<typeof onboardingSchema>

export type Role = 'trainee' | 'trainer'
export type Gender = 'male' | 'female' | 'other'
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'high'

export interface OnboardingFormData {
  gender: Gender
  age: string
  height: string
  weight: string
  activityLevel: ActivityLevel
  goals: string[]
  specialties: string[]
  preferredWorkoutTypes: string[]
  certifications: string[]
  frequencyPerWeek: string
  targetTimeline: string
  availability: string[]
}

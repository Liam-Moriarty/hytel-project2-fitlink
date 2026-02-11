/* eslint-disable @typescript-eslint/no-explicit-any */
import { OnboardingFormValues } from '@/pages/onboarding/schemas'
import { UseFormReturn } from 'react-hook-form'

export type Role = 'trainee' | 'trainer'
export type Gender = 'male' | 'female' | 'other'
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'high'

export interface UserData {
  uid: string
  email: string | null
  displayName: string | null
  role?: 'trainee' | 'trainer'
  gender?: string
  age?: number
  height?: number
  weight?: number
  activityLevel?: string
  profilePicUrl?: string
  createdAt: any
  traineeGoals?: any
}

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

export interface OnBoardStep1Props {
  role: Role
  setRole: (role: Role) => void
}

export interface OnBoardStepProps {
  role?: Role
  form: UseFormReturn<OnboardingFormValues>
}

export interface HeaderProps {
  userData: UserData | null
  progressPercentage: number
  completedCount: number
  totalWorkouts: number
}

export interface GoalsCardProps {
  userData: UserData | null
}

export interface FooterProps {
  userData: UserData | null
}

export interface DietaryPlanProps {
  workoutPlan: any
}

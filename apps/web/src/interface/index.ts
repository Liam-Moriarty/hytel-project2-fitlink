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

export interface AchievementsProps {
  achievements: any[]
}

export interface WeeklyProgress {
  week: string
  weekNumber: number
  total: number
  completed: number
  percentage: number
}

export interface WeeklyActivityProps {
  weeklyProgress: WeeklyProgress[]
  currentPage: number
  totalPages: number
  currentWeeks: WeeklyProgress[]
  startIndex: number
  totalCompleted: number
  handlePrevPage: () => void
  handleNextPage: () => void
  itemsPerPage: number
}

export interface TopStatsGridProps {
  completionPercentage: number
  totalCompleted: number
  totalBurned: number
  targetTimeline?: string
}

export interface ProfileUserProps {
  user: UserData
}

export interface DashboardAchievementsProps {
  achievements: any[]
  activeAchievements: any[]
  navigate: (path: string) => void
}

export interface GoalsOverviewProps {
  userData: UserData | null
}

export interface DashboardHeaderProps {
  userData: UserData | null
}

export interface MotivationCardProps {
  totalCompleted: number
  totalBurned: number
  completionPercentage: number
}

export interface TodayWorkoutProps {
  todayWorkout: any | null
  navigate: (path: string) => void
}

export interface DashboardTopStatsGridProps {
  completionPercentage: number
  totalCompleted: number
  totalWorkouts: number
  totalBurned: number
}

export interface WeekProgressProps {
  currentWeekProgress: {
    weekNumber: number
    completed: number
    total: number
    percentage: number
  }
  navigate: (path: string) => void
}

// Trainer Clients Page
export interface TrainerProfile {
  userId: string
  specialties: string[]
  certifications: string[]
  availability: string[]
  traineeIds: string[]
  createdAt: any
}

export interface ClientsHeaderProps {
  clientCount: number
}

export interface InviteCardProps {
  trainerId: string
  existingTraineeIds: string[]
}

export interface ClientsTableProps {
  clients: UserData[]
  trainerId: string
  isLoading: boolean
}

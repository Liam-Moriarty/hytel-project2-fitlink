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

// Trainer Schedule Page
export interface ScheduleHeaderProps {
  availableDaysCount: number
}

export interface AvailabilityCardProps {
  trainerId: string
  availability: string[]
}

export interface CertificationsCardProps {
  trainerId: string
  certifications: string[]
}

// Trainer Profile Page
export interface TrainerOverviewProps {
  clientCount: number
  certificationsCount: number
  availableDaysCount: number
}

export interface TrainerSpecialtiesProps {
  trainerId: string
  specialties: string[]
}

export interface TrainerSettingsCardProps {
  user: UserData
}

// Trainer Analytics Page
export interface WeeklyCalorieData {
  weekNumber: number
  caloriesBurned: number
  workoutsCompleted: number
}

export interface TraineeAnalytics {
  userId: string
  userName: string
  email: string
  weeklyCalories: WeeklyCalorieData[]
  weeklyDietaryAdherence: {
    weekNumber: number
    adherencePercentage: number
    completedDays: number
    totalDays: number
  }[]
  totalCaloriesBurned: number
  totalWorkoutsCompleted: number
  progressPercentage: number
  currentWeek: number
  targetTimeline?: string
  // Dietary tracking fields
  totalMealDaysCompleted: number
  totalMealDays: number
  dietaryAdherencePercentage: number
  avgDailyCalories: number
}

export interface AnalyticsChartData {
  week: number
  [traineeId: string]: number | string
}

// ---------- Dietary Plan Page Interfaces ----------

export interface DietaryHeaderProps {
  userData: UserData | null
  progressPercentage: number
  completedCount: number
  totalMealDays: number
}

export interface DietaryGoalsCardProps {
  userData: UserData | null
  dailyIntakeGoal: number
  totalWeeks: number
}

export interface MealPlanTabsProps {
  workoutPlan: any
  completedMeals: Set<string>
  toggleMealCompletion: (weekNum: number, dayNum: number) => void
}

export interface DietaryFooterProps {
  userData: UserData | null
}

// ---------- Dietary Progress Interfaces ----------

export interface DietaryStatsCardProps {
  totalMealDays: number
  completedMealDays: number
  adherencePercentage: number
  avgDailyCalories: number
  currentStreak: number
}

export interface WeeklyDietaryProgress {
  week: string
  weekNumber: number
  total: number
  completed: number
  percentage: number
}

export interface WeeklyDietaryActivityProps {
  weeklyProgress: WeeklyDietaryProgress[]
  currentPage: number
  totalPages: number
  currentWeeks: WeeklyDietaryProgress[]
  startIndex: number
  totalCompleted: number
  handlePrevPage: () => void
  handleNextPage: () => void
  itemsPerPage: number
}

export interface DietarySummaryCardProps {
  adherencePercentage: number
  completedMealDays: number
  totalMealDays: number
  currentWeekCompleted: number
  currentWeekTotal: number
  navigate: (path: string) => void
}

export interface EditProfileSheetProps {
  user: UserData
}

export interface DietarySummaryCardProps {
  adherencePercentage: number
  completedMealDays: number
  totalMealDays: number
  currentWeekCompleted: number
  currentWeekTotal: number
  navigate: (path: string) => void
}

export interface DietaryStatsCardProps {
  totalMealDays: number
  completedMealDays: number
  adherencePercentage: number
  avgDailyCalories: number
  currentStreak: number
}

export interface WorkoutTabsProps {
  workoutPlan: any
  completedWorkouts: Set<string>
  toggleWorkoutCompletion: (weekNum: number, dayNum: number) => void
}

export interface IndividualTraineeDetailsProps {
  analyticsData: TraineeAnalytics[]
}

export interface ProgressLineChartProps {
  selectedTrainees: string[]
  chartData: AnalyticsChartData[]
  dietaryChartData: AnalyticsChartData[]
  analyticsData: TraineeAnalytics[]
  chartConfig: Record<string, { label: string; color: string }>
  dietaryChartConfig: Record<string, { label: string; color: string }>
}

export interface StatsGridProps {
  aggregateStats: {
    totalWorkouts: number
    totalCalories: number
    avgProgress: number
    avgDietaryAdherence: number
  }
}

export interface TraineeSelectorProps {
  clients: UserData[]
  selectedTrainees: string[]
  onTraineeSelect: (traineeId: string) => void
}

export interface ClientProgressSummaryProps {
  clients: TraineeAnalytics[]
  navigate: (path: string) => void
}

export interface DietaryProgressSummaryProps {
  clients: TraineeAnalytics[]
  navigate: (path: string) => void
}

export interface QuickActionsProps {
  navigate: (path: string) => void
}

export interface ScheduleOverviewProps {
  availability: string[]
  navigate: (path: string) => void
}

export interface TrainerStatsGridProps {
  totalClients: number
  totalWorkouts: number
  successRate: number
  totalCalories: number
}

export interface CalorieBurnChartSummaryProps {
  clients: UserData[]
  analyticsData: TraineeAnalytics[]
}

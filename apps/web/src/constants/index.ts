import {
  Home,
  TrendingUp,
  User,
  Dumbbell,
  Users,
  Calendar,
  BarChart3,
  Trophy,
  Zap,
  Medal,
  Flame,
  Target,
  Award,
} from 'lucide-react'

// Generate consistent color based on email
export const getAvatarColor = (email: string) => {
  const colors = [
    { bg: 'bg-red-400', text: 'text-black' },
    { bg: 'bg-blue-400', text: 'text-black' },
    { bg: 'bg-green-400', text: 'text-black' },
    { bg: 'bg-yellow-400', text: 'text-black' },
    { bg: 'bg-purple-400', text: 'text-black' },
    { bg: 'bg-pink-400', text: 'text-black' },
    { bg: 'bg-indigo-400', text: 'text-black' },
    { bg: 'bg-orange-400', text: 'text-black' },
    { bg: 'bg-teal-400', text: 'text-black' },
    { bg: 'bg-cyan-400', text: 'text-black' },
  ]
  const charCode = email.charCodeAt(0) || 0
  return colors[charCode % colors.length]
}

export const navItems = [
  { name: 'Dashboard', path: '/dashboard/trainee', icon: Home },
  { name: 'Workout Plan', path: '/dashboard/trainee/workout-plan', icon: Dumbbell },
  { name: 'Progress', path: '/dashboard/trainee/progress', icon: TrendingUp },
  { name: 'Profile', path: '/dashboard/trainee/profile', icon: User },
]

export const navItemsTrainer = [
  { name: 'Dashboard', path: '/dashboard/trainer', icon: Home },
  { name: 'My Clients', path: '/dashboard/trainer/clients', icon: Users },
  { name: 'Schedule', path: '/dashboard/trainer/schedule', icon: Calendar },
  { name: 'Analytics', path: '/dashboard/trainer/analytics', icon: BarChart3 },
  { name: 'Profile', path: '/dashboard/trainer/profile', icon: User },
]

export const workoutTypes = [
  'Running',
  'Cycling',
  'Swimming',
  'Weightlifting',
  'Yoga',
  'Pilates',
  'HIIT',
]
export const certifications = ['ACE', 'NASM', 'ISSA', 'ACSM', 'CrossFit Level 1']

export const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

export const frequencyOptions = [
  { value: '1', label: '1 day per week' },
  { value: '2', label: '2 days per week' },
  { value: '3', label: '3 days per week' },
  { value: '4', label: '4 days per week' },
  { value: '5', label: '5 days per week' },
  { value: '6', label: '6 days per week' },
  { value: '7', label: '7 days per week' },
]

export const timelineOptions = [
  { value: '1 month', label: '1 Month' },
  { value: '3 months', label: '3 Months' },
  { value: '6 months', label: '6 Months' },
  { value: '1 year', label: '1 Year' },
]

export const getAchievements = (totalCompleted: number) => [
  {
    title: 'First Week',
    desc: 'Complete week 1',
    icon: Flame,
    color: 'text-orange-500',
    bg: 'bg-orange-100',
    active: true,
  },
  {
    title: '10 Workouts',
    desc: 'Complete 10 sessions',
    icon: Dumbbell,
    color: 'text-amber-600',
    bg: 'bg-amber-100',
    active: true,
  },
  {
    title: 'Week Streak',
    desc: '7 days in a row',
    icon: Zap,
    color: 'text-yellow-500',
    bg: 'bg-yellow-100',
    active: true,
  },
  {
    title: '20 Workouts',
    desc: 'Consistency key',
    icon: Target,
    color: 'text-blue-500',
    bg: 'bg-blue-100',
    active: totalCompleted >= 20,
  },
  {
    title: '30 Workouts',
    desc: 'On fire!',
    icon: Trophy,
    color: 'text-purple-500',
    bg: 'bg-slate-100',
    active: totalCompleted >= 30,
    grayscale: true,
  },
  {
    title: 'Month Streak',
    desc: '30 days consistency',
    icon: Medal,
    color: 'text-emerald-500',
    bg: 'bg-slate-100',
    active: false,
    grayscale: true,
  },
  {
    title: '50 Workouts',
    desc: 'Half century',
    icon: Award,
    color: 'text-indigo-500',
    bg: 'bg-slate-100',
    active: false,
    grayscale: true,
  },
  {
    title: '100 Workouts',
    desc: 'Century club',
    icon: Award,
    color: 'text-pink-500',
    bg: 'bg-slate-100',
    active: false,
    grayscale: true,
  },
  {
    title: 'Consistency',
    desc: 'Worked out every day',
    icon: Calendar,
    color: 'text-cyan-500',
    bg: 'bg-slate-100',
    active: false,
    grayscale: true,
  },
]

import { Home, TrendingUp, User, Dumbbell, Users, Calendar, BarChart3 } from 'lucide-react'

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
  { name: 'Dashboard', path: '/dashboard', icon: Home },
  { name: 'Workout Plan', path: '/dashboard/workout-plan', icon: Dumbbell },
  { name: 'Progress', path: '/dashboard/progress', icon: TrendingUp },
  { name: 'Profile', path: '/dashboard/profile', icon: User },
]

export const navItemsTrainer = [
  { name: 'Dashboard', path: '/dashboard', icon: Home },
  { name: 'My Clients', path: '/dashboard/clients', icon: Users },
  { name: 'Schedule', path: '/dashboard/schedule', icon: Calendar },
  { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Profile', path: '/dashboard/profile', icon: User },
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
  { value: '1_month', label: '1 Month' },
  { value: '3_months', label: '3 Months' },
  { value: '6_months', label: '6 Months' },
  { value: '1_year', label: '1 Year' },
]

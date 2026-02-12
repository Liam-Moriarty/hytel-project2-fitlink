import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { updateUser, createTraineeGoals, createTrainerProfile } from '@/lib/api/user'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import OnBoardStep1 from './OnBoardStep1'
import OnBoardStep2 from './OnBoardStep2'
import OnBoardStep3 from './OnBoardStep3'
import OnBoardStep4 from './OnBoardStep4'
import OnBoardStep5 from './OnBoardStep5'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { onboardingSchema, OnboardingFormValues } from './schemas'
import { Form } from '@/components/ui/form'
import { Role } from '@/interface'

const GetToKnow = () => {
  const navigate = useNavigate()
  const { user, setUserData } = useAuthStore()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<Role>('trainee')

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      gender: undefined,
      age: '',
      height: '',
      weight: '',
      activityLevel: undefined,
      goals: [],
      specialties: [],
      preferredWorkoutTypes: [],
      certifications: [],
      frequencyPerWeek: '3',
      targetTimeline: '3_months',
      availability: [],
    },
    mode: 'onChange',
  })

  const { trigger, getValues } = form

  const handleNext = async () => {
    // Step 2 Validation
    if (step === 2) {
      const isValid = await trigger(['gender', 'age', 'height', 'weight', 'activityLevel'])
      if (!isValid) return
    }

    // Step 3 Validation
    if (step === 3) {
      if (role === 'trainee') {
        const goals = getValues('goals')
        if (goals.length === 0) {
          form.setError('goals', { message: 'Please select at least one goal' })
          return
        }
        form.clearErrors('goals')
      } else {
        const specialties = getValues('specialties')
        if (specialties.length === 0) {
          form.setError('specialties', { message: 'Please select at least one specialty' })
          return
        }
        form.clearErrors('specialties')
      }
    }

    // Step 4 Validation
    if (step === 4) {
      if (role === 'trainee') {
        const workouts = getValues('preferredWorkoutTypes')
        if (workouts.length === 0) {
          form.setError('preferredWorkoutTypes', {
            message: 'Please select at least one workout type',
          })
          return
        }
      } else {
        const certs = getValues('certifications')
        if (certs.length === 0) {
          form.setError('certifications', { message: 'Please select at least one certification' })
          return
        }
      }

      setStep(prev => prev + 1)
      return
    }

    // Step 5 Validation
    if (step === 5) {
      if (role === 'trainee') {
        const frequency = getValues('frequencyPerWeek')
        const timeline = getValues('targetTimeline')
        if (!frequency || !timeline) {
          // Should be covered by default values but good to check
          return
        }
      } else {
        const availability = getValues('availability')
        if (availability.length === 0) {
          form.setError('availability', { message: 'Please select at least one available day' })
          return
        }
      }

      handleSubmit(getValues())
      return
    }

    setStep(prev => prev + 1)
  }

  const handleBack = () => {
    setStep(prev => prev - 1)
  }

  const handleSubmit = async (data: OnboardingFormValues) => {
    if (!user) return
    setLoading(true)

    try {
      // 1. Update User Profile
      const userData = {
        role,
        gender: data.gender,
        age: Number(data.age),
        height: Number(data.height),
        weight: Number(data.weight),
        activityLevel: data.activityLevel,
      }

      await updateUser(user.uid, userData)

      // 2. Create Role Specific Data
      if (role === 'trainee') {
        await createTraineeGoals(user.uid, {
          goals: data.goals,
          preferredWorkoutTypes: data.preferredWorkoutTypes,
          frequencyPerWeek: Number(data.frequencyPerWeek),
          targetTimeline: data.targetTimeline,
        })
      } else {
        await createTrainerProfile(user.uid, {
          specialties: data.specialties,
          certifications: data.certifications,
          availability: data.availability,
          traineeIds: [],
        })
      }

      // 3. Update local store and redirect
      setUserData({
        ...userData,
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        createdAt: new Date(),
      })
      navigate(role === 'trainer' ? '/dashboard/trainer' : '/dashboard/trainee')
    } catch (error) {
      console.error('Error saving onboarding data:', error)
      alert('Failed to save data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <CardTitle className="text-2xl">
                {step === 1 && 'Welcome to FitLink!'}
                {step === 2 && 'Tell us about yourself'}
                {step === 3 && (role === 'trainee' ? 'Set your goals' : 'Your Expertise')}
                {step === 4 && (role === 'trainee' ? 'Workout Preferences' : 'Qualifications')}
                {step === 5 && (role === 'trainee' ? 'Final Details' : 'Availability')}
              </CardTitle>
              <CardDescription>Step {step} of 5</CardDescription>
            </div>
            {step > 1 && (
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}
          </div>
          {/* Progress Bar */}
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-in-out"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            {step === 1 && <OnBoardStep1 role={role} setRole={setRole} />}
            {step === 2 && <OnBoardStep2 form={form} />}
            {step === 3 && <OnBoardStep3 role={role} form={form} />}
            {step === 4 && <OnBoardStep4 role={role} form={form} />}
            {step === 5 && <OnBoardStep5 role={role} form={form} />}
          </Form>
        </CardContent>

        <CardFooter className="flex justify-between mt-6">
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack} disabled={loading}>
              Back
            </Button>
          ) : (
            <div></div> // Spacer
          )}

          <Button onClick={handleNext} disabled={loading} className="px-8">
            {loading ? (
              'Saving...'
            ) : step === 5 ? (
              'Finish'
            ) : (
              <span className="flex items-center">
                Next <ChevronRight className="w-4 h-4 ml-2" />
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default GetToKnow

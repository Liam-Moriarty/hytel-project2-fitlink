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
import { Role, Gender, ActivityLevel, OnboardingFormData } from './types'
import OnBoardStep1 from './OnBoardStep1'
import OnBoardStep2 from './OnBoardStep2'
import OnBoardStep3 from './OnBoardStep3'
import OnBoardStep4 from './OnBoardStep4'

const GetToKnow = () => {
  const navigate = useNavigate()
  const { user, setUserData } = useAuthStore()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Form State
  const [role, setRole] = useState<Role>('trainee')
  const [formData, setFormData] = useState<OnboardingFormData>({
    gender: '' as Gender,
    age: '',
    height: '',
    weight: '',
    activityLevel: '' as ActivityLevel,
    goals: [],
    specialties: [],
    preferredWorkoutTypes: [],
    certifications: [],
  })

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const toggleSelection = (field: keyof OnboardingFormData, value: string) => {
    setFormData(prev => {
      const current = prev[field] as string[]
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value]
      return { ...prev, [field]: updated }
    })
  }

  const handleNext = () => {
    // Basic validation
    if (step === 2) {
      if (
        !formData.gender ||
        !formData.age ||
        !formData.height ||
        !formData.weight ||
        !formData.activityLevel
      ) {
        alert('Please fill in all fields')
        return
      }
    }
    if (step === 3) {
      if (role === 'trainee' && formData.goals.length === 0) {
        alert('Please select at least one goal')
        return
      }
      if (role === 'trainer' && formData.specialties.length === 0) {
        alert('Please select at least one specialty')
        return
      }
    }
    if (step === 4) {
      handleSubmit()
      return
    }

    setStep(prev => prev + 1)
  }

  const handleBack = () => {
    setStep(prev => prev - 1)
  }

  const handleSubmit = async () => {
    if (!user) return
    setLoading(true)

    try {
      // 1. Update User Profile
      const userData = {
        role,
        gender: formData.gender,
        age: Number(formData.age),
        height: Number(formData.height),
        weight: Number(formData.weight),
        activityLevel: formData.activityLevel,
        // profilePicUrl: user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=random`,
      }

      await updateUser(user.uid, userData)

      // 2. Create Role Specific Data
      if (role === 'trainee') {
        await createTraineeGoals(user.uid, {
          goals: formData.goals,
          preferredWorkoutTypes: formData.preferredWorkoutTypes,
          frequencyPerWeek: 3, // Default for now
          targetTimeline: '3 months', // Default for now
        })
      } else {
        await createTrainerProfile(user.uid, {
          specialties: formData.specialties,
          certifications: formData.certifications,
          availability: [], // Empty initially
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
      navigate('/dashboard')
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
              </CardTitle>
              <CardDescription>Step {step} of 4</CardDescription>
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
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </CardHeader>

        <CardContent>
          {step === 1 && <OnBoardStep1 role={role} setRole={setRole} />}
          {step === 2 && (
            <OnBoardStep2
              formData={formData}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
            />
          )}
          {step === 3 && (
            <OnBoardStep3 role={role} formData={formData} toggleSelection={toggleSelection} />
          )}
          {step === 4 && (
            <OnBoardStep4 role={role} formData={formData} toggleSelection={toggleSelection} />
          )}
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
            ) : step === 4 ? (
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

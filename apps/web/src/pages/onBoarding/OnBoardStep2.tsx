import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { OnboardingFormData } from './types'

interface OnBoardStep2Props {
  formData: OnboardingFormData
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSelectChange: (name: string, value: string) => void
}

const OnBoardStep2 = ({ formData, handleInputChange, handleSelectChange }: OnBoardStep2Props) => {
  return (
    <div className="space-y-4 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={formData.gender} onValueChange={val => handleSelectChange('gender', val)}>
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            name="age"
            type="number"
            placeholder="25"
            value={formData.age}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            name="height"
            type="number"
            placeholder="175"
            value={formData.height}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            placeholder="70"
            value={formData.weight}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="activity">Activity Level</Label>
          <Select
            value={formData.activityLevel}
            onValueChange={val => handleSelectChange('activityLevel', val)}
          >
            <SelectTrigger id="activity">
              <SelectValue placeholder="Select activity level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentary (Little or no exercise)</SelectItem>
              <SelectItem value="light">Light (Exercise 1-3 days/week)</SelectItem>
              <SelectItem value="moderate">Moderate (Exercise 3-5 days/week)</SelectItem>
              <SelectItem value="high">High (Exercise 6-7 days/week)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default OnBoardStep2

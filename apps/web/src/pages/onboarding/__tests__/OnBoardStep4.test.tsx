/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createElement } from 'react'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'

import OnBoardStep4 from '../OnBoardStep4'

const TestWrapper = ({ role }: { role: 'trainee' | 'trainer' }) => {
  const form = useForm({
    defaultValues: { preferredWorkoutTypes: [], certifications: [] },
  })
  return createElement(
    Form,
    { ...form } as any,
    createElement(OnBoardStep4, { role, form: form as any })
  )
}

describe('OnBoardStep4', () => {
  it('renders workout preferences for trainee', () => {
    render(createElement(TestWrapper, { role: 'trainee' }))
    expect(screen.getByText('Preferred Workouts')).toBeInTheDocument()
  })

  it('renders certifications for trainer', () => {
    render(createElement(TestWrapper, { role: 'trainer' }))
    expect(screen.getByText('Certifications')).toBeInTheDocument()
  })
})

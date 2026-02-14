/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createElement } from 'react'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'

import OnBoardStep5 from '../OnBoardStep5'

const TestWrapper = ({ role }: { role: 'trainee' | 'trainer' }) => {
  const form = useForm({
    defaultValues: { frequencyPerWeek: '3', targetTimeline: '3_months', availability: [] },
  })
  return createElement(
    Form,
    { ...form } as any,
    createElement(OnBoardStep5, { role, form: form as any })
  )
}

describe('OnBoardStep5', () => {
  it('renders timeline and frequency for trainee', () => {
    render(createElement(TestWrapper, { role: 'trainee' }))
    expect(screen.getByText('What is your target timeline?')).toBeInTheDocument()
    expect(screen.getByText('How many days per week can you workout?')).toBeInTheDocument()
  })

  it('renders availability for trainer', () => {
    render(createElement(TestWrapper, { role: 'trainer' }))
    expect(screen.getByText('Availability')).toBeInTheDocument()
    expect(screen.getByText('Monday')).toBeInTheDocument()
  })
})

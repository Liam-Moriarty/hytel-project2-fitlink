/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createElement } from 'react'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'

import OnBoardStep3 from '../OnBoardStep3'

const TestWrapper = ({ role }: { role: 'trainee' | 'trainer' }) => {
  const form = useForm({
    defaultValues: { goals: [], specialties: [] },
  })
  return createElement(
    Form,
    { ...form } as any,
    createElement(OnBoardStep3, { role, form: form as any })
  )
}

describe('OnBoardStep3', () => {
  it('renders goals for trainee', () => {
    render(createElement(TestWrapper, { role: 'trainee' }))
    expect(screen.getByText('What are your goals?')).toBeInTheDocument()
    expect(screen.getByText('Weight Loss')).toBeInTheDocument()
  })

  it('renders specialties for trainer', () => {
    render(createElement(TestWrapper, { role: 'trainer' }))
    expect(screen.getByText('What are your specialties?')).toBeInTheDocument()
    expect(screen.getByText('Strength Training')).toBeInTheDocument()
  })
})

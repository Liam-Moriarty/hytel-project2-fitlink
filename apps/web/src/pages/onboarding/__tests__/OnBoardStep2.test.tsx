/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createElement } from 'react'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'

import OnBoardStep2 from '../OnBoardStep2'

// Wrapper to provide form context
const TestWrapper = () => {
  const form = useForm()
  return createElement(Form, { ...form } as any, createElement(OnBoardStep2, { form: form as any }))
}

describe('OnBoardStep2', () => {
  it('renders personal info inputs', () => {
    render(createElement(TestWrapper))

    expect(screen.getByText('Gender')).toBeInTheDocument()
    expect(screen.getByText('Age')).toBeInTheDocument() // Label or placeholder check
    expect(screen.getByText('Height (cm)')).toBeInTheDocument()
    expect(screen.getByText('Weight (kg)')).toBeInTheDocument()
    expect(screen.getByText('Activity Level')).toBeInTheDocument()
  })
})

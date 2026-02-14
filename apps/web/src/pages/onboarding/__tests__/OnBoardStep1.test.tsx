/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createElement } from 'react'

import OnBoardStep1 from '../OnBoardStep1'

describe('OnBoardStep1', () => {
  it('renders role selection cards', () => {
    const setRole = vi.fn()
    render(createElement(OnBoardStep1, { role: 'trainee', setRole }))

    expect(screen.getByText('I am a Trainee')).toBeInTheDocument()
    expect(screen.getByText('I am a Trainer')).toBeInTheDocument()
  })

  it('calls setRole when Trainer card is clicked', () => {
    const setRole = vi.fn()
    render(createElement(OnBoardStep1, { role: 'trainee', setRole }))

    fireEvent.click(screen.getByText('I am a Trainer').closest('div')!)
    expect(setRole).toHaveBeenCalledWith('trainer')
  })
})

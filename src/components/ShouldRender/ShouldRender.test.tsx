import { render, screen } from '@testing-library/preact'
import { describe, expect, it } from 'vitest'
import { ShouldRender } from '.'

describe('ShouldRender', () => {
  it('renders its children when the condition is true', () => {
    render(<ShouldRender if={true}>Visible content</ShouldRender>)

    expect(screen.getByText('Visible content')).toBeInTheDocument()
  })

  it('does not render its children when the condition is false', () => {
    render(<ShouldRender if={false}>Hidden content</ShouldRender>)

    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument()
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/utils'
import { Pagination } from './Pagination'
import userEvent from '@testing-library/user-event'

describe('Pagination Accessibility', () => {
  const mockOnPageChange = vi.fn()
  const mockOnPerPageChange = vi.fn()

  it('should have accessible navigation landmark', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    const nav = screen.getByRole('navigation', { name: /pagination/i })
    expect(nav).toBeInTheDocument()
  })

  it('should have accessible previous/next buttons', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    // Desktop view
    const prevButtons = screen.getAllByRole('button', { name: /previous/i })
    expect(prevButtons.length).toBeGreaterThan(0)
    prevButtons.forEach(btn => {
      expect(btn).not.toBeDisabled()
    })

    const nextButtons = screen.getAllByRole('button', { name: /next/i })
    expect(nextButtons.length).toBeGreaterThan(0)
    nextButtons.forEach(btn => {
      expect(btn).not.toBeDisabled()
    })
  })

  it('should disable previous button on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    const prevButtons = screen.getAllByRole('button', { name: /previous/i })
    prevButtons.forEach(btn => {
      expect(btn).toBeDisabled()
    })
  })

  it('should disable next button on last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    const nextButtons = screen.getAllByRole('button', { name: /next/i })
    nextButtons.forEach(btn => {
      expect(btn).toBeDisabled()
    })
  })

  it('should have accessible page number buttons', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    // Check for page buttons
    const pageButtons = screen.getAllByRole('button')
    expect(pageButtons.length).toBeGreaterThan(2) // More than just prev/next
  })

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup()
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    // Tab to first button
    await user.tab()
    
    const firstButton = screen.getAllByRole('button')[0]
    expect(firstButton).toHaveFocus()
  })

  it('should have proper focus indicators', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    const buttons = screen.getAllByRole('button')
    // At least some buttons should have focus classes
    const buttonsWithFocus = buttons.filter(btn => btn.className.includes('focus'))
    expect(buttonsWithFocus.length).toBeGreaterThan(0)
  })

  it('should have accessible per-page selector', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        perPage={25}
        onPerPageChange={mockOnPerPageChange}
      />
    )

    const select = screen.getByLabelText(/per page/i)
    expect(select).toBeInTheDocument()
    expect(select).toHaveAttribute('id', 'perPage')
  })

  it('should show current page information', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    expect(screen.getByText(/page/i)).toBeInTheDocument()
    // Current page and total pages are shown in the text
    const pageInfo = screen.getByText(/page/i).parentElement
    expect(pageInfo?.textContent).toContain('2')
    expect(pageInfo?.textContent).toContain('5')
  })

  it('should have proper ARIA attributes for disabled buttons', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    const prevButtons = screen.getAllByRole('button', { name: /previous/i })
    prevButtons.forEach(btn => {
      expect(btn).toHaveAttribute('disabled')
    })
  })

  it('should highlight current page visually', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    const pageButtons = screen.getAllByRole('button')
    const currentPageButton = pageButtons.find(btn => 
      btn.textContent === '3' && btn.className.includes('bg-blue-600')
    )
    
    expect(currentPageButton).toBeTruthy()
  })

  it('should support screen reader text', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    // Check for sr-only text
    const srTexts = screen.getAllByText(/previous|next/i)
    expect(srTexts.length).toBeGreaterThan(0)
  })
})

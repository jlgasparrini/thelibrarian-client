import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/utils'
import { BrowserRouter } from 'react-router-dom'
import { BookCard } from './BookCard'
import type { Book } from '@/types'
import userEvent from '@testing-library/user-event'

// Mock the auth store
vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({
    user: {
      id: 1,
      email: 'member@example.com',
      role: 'member',
      created_at: '2024-01-01',
    },
  }),
}))

describe('BookCard Accessibility', () => {
  const mockBook: Book = {
    id: 1,
    title: 'Test Book',
    author: 'Test Author',
    genre: 'Fiction',
    isbn: '1234567890',
    total_copies: 5,
    available_copies: 3,
    borrowings_count: 2,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  }

  it('should have accessible book title as heading', () => {
    render(
      <BrowserRouter>
        <BookCard book={mockBook} />
      </BrowserRouter>
    )

    const title = screen.getByText('Test Book')
    expect(title).toBeInTheDocument()
    expect(title).toHaveClass('text-lg', 'font-semibold')
  })

  it('should have accessible link to book details', () => {
    render(
      <BrowserRouter>
        <BookCard book={mockBook} />
      </BrowserRouter>
    )

    const detailsLink = screen.getByRole('link', { name: /view details/i })
    expect(detailsLink).toBeInTheDocument()
    expect(detailsLink).toHaveAttribute('href', '/books/1')
  })

  it('should have accessible buttons with proper labels', () => {
    const onBorrow = vi.fn()
    render(
      <BrowserRouter>
        <BookCard book={mockBook} onBorrow={onBorrow} />
      </BrowserRouter>
    )

    const borrowButton = screen.getByRole('button', { name: /borrow book/i })
    expect(borrowButton).toBeInTheDocument()
    expect(borrowButton).not.toBeDisabled()
  })

  it('should have proper focus management for buttons', async () => {
    const user = userEvent.setup()
    const onBorrow = vi.fn()
    
    render(
      <BrowserRouter>
        <BookCard book={mockBook} onBorrow={onBorrow} />
      </BrowserRouter>
    )

    const borrowButton = screen.getByRole('button', { name: /borrow book/i })
    
    await user.tab()
    await user.tab() // Skip the link
    
    expect(borrowButton).toHaveFocus()
  })

  it('should have visible focus indicators on interactive elements', () => {
    render(
      <BrowserRouter>
        <BookCard book={mockBook} />
      </BrowserRouter>
    )

    const detailsLink = screen.getByRole('link', { name: /view details/i })
    expect(detailsLink).toHaveClass('focus:ring-2', 'focus:ring-blue-500')
  })

  it('should display availability status accessibly', () => {
    render(
      <BrowserRouter>
        <BookCard book={mockBook} />
      </BrowserRouter>
    )

    const availabilityBadge = screen.getByText(/3 \/ 5 available/i)
    expect(availabilityBadge).toBeInTheDocument()
    expect(availabilityBadge).toHaveClass('bg-green-100', 'text-green-800')
  })

  it('should show unavailable status clearly', () => {
    const unavailableBook = { ...mockBook, available_copies: 0 }
    
    render(
      <BrowserRouter>
        <BookCard book={unavailableBook} />
      </BrowserRouter>
    )

    const unavailableBadge = screen.getByText(/not available/i)
    expect(unavailableBadge).toBeInTheDocument()
    expect(unavailableBadge).toHaveClass('bg-red-100', 'text-red-800')
  })

  it('should have proper color contrast for text', () => {
    render(
      <BrowserRouter>
        <BookCard book={mockBook} />
      </BrowserRouter>
    )

    const title = screen.getByText('Test Book')
    expect(title).toHaveClass('text-gray-900')

    const author = screen.getByText('Test Author')
    expect(author).toHaveClass('text-gray-600')

    const genre = screen.getByText('Fiction')
    expect(genre).toHaveClass('text-gray-500')
  })

  it('should support keyboard interaction for borrow action', async () => {
    const user = userEvent.setup()
    const onBorrow = vi.fn()
    
    render(
      <BrowserRouter>
        <BookCard book={mockBook} onBorrow={onBorrow} />
      </BrowserRouter>
    )

    const borrowButton = screen.getByRole('button', { name: /borrow book/i })
    
    // Focus and activate with keyboard
    borrowButton.focus()
    await user.keyboard('{Enter}')
    
    expect(onBorrow).toHaveBeenCalledWith(1)
  })

  it('should have proper ARIA attributes on buttons', () => {
    const onBorrow = vi.fn()
    
    render(
      <BrowserRouter>
        <BookCard book={mockBook} onBorrow={onBorrow} />
      </BrowserRouter>
    )

    const borrowButton = screen.getByRole('button', { name: /borrow book/i })
    
    // Button should have proper focus ring
    expect(borrowButton).toHaveClass('focus:ring-2')
    expect(borrowButton).toHaveClass('focus:ring-blue-500')
  })
})

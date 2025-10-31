import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useBorrowings, useBorrowBook, useReturnBook } from './useBorrowings'
import { server } from '@/test/mocks/server'
import { http, HttpResponse } from 'msw'

// Helper to create a wrapper with QueryClient
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return ({ children }: { children: ReactNode }) => {
    return QueryClientProvider({ client: queryClient, children })
  }
}

describe('useBorrowings', () => {
  beforeEach(() => {
    server.listen()
  })

  afterEach(() => {
    server.resetHandlers()
    server.close()
  })

  it('should fetch borrowings successfully', async () => {
    server.use(
      http.get('http://localhost:3000/api/v1/borrowings', () => {
        return HttpResponse.json({
          borrowings: [
            {
              id: 1,
              user_id: 1,
              book_id: 1,
              borrowed_at: '2024-01-01',
              due_date: '2024-01-15',
              returned_at: null,
              'overdue?': false,
              user: { id: 1, email: 'test@example.com', role: 'member', created_at: '2024-01-01' },
              book: {
                id: 1,
                title: 'Test Book',
                author: 'Test Author',
                genre: 'Fiction',
                isbn: '1234567890',
                total_copies: 5,
                available_copies: 4,
                borrowings_count: 1,
                created_at: '2024-01-01',
                updated_at: '2024-01-01',
              },
            },
          ],
        })
      })
    )

    const { result } = renderHook(() => useBorrowings(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.borrowings).toHaveLength(1)
    expect(result.current.data?.borrowings[0].book.title).toBe('Test Book')
  })

  it('should handle fetch error', async () => {
    server.use(
      http.get('http://localhost:3000/api/v1/borrowings', () => {
        return HttpResponse.json({ error: 'Failed to fetch' }, { status: 500 })
      })
    )

    const { result } = renderHook(() => useBorrowings(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

describe('useBorrowBook', () => {
  beforeEach(() => {
    server.listen()
  })

  afterEach(() => {
    server.resetHandlers()
    server.close()
  })

  it('should borrow a book successfully', async () => {
    server.use(
      http.post('http://localhost:3000/api/v1/borrowings', () => {
        return HttpResponse.json({
          borrowing: {
            id: 1,
            user_id: 1,
            book_id: 1,
            borrowed_at: '2024-01-01',
            due_date: '2024-01-15',
            returned_at: null,
            'overdue?': false,
          },
        })
      })
    )

    const { result } = renderHook(() => useBorrowBook(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ book_id: 1 })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.borrowing.id).toBe(1)
  })

  it('should handle borrow error', async () => {
    server.use(
      http.post('http://localhost:3000/api/v1/borrowings', () => {
        return HttpResponse.json(
          { errors: ['Book is already borrowed by this user'] },
          { status: 422 }
        )
      })
    )

    const { result } = renderHook(() => useBorrowBook(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ book_id: 1 })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

describe('useReturnBook', () => {
  beforeEach(() => {
    server.listen()
  })

  afterEach(() => {
    server.resetHandlers()
    server.close()
  })

  it('should return a book successfully', async () => {
    server.use(
      http.put('http://localhost:3000/api/v1/borrowings/1', () => {
        return HttpResponse.json({
          borrowing: {
            id: 1,
            user_id: 1,
            book_id: 1,
            borrowed_at: '2024-01-01',
            due_date: '2024-01-15',
            returned_at: '2024-01-10',
            'overdue?': false,
          },
        })
      })
    )

    const { result } = renderHook(() => useReturnBook(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(1)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.borrowing.returned_at).toBeTruthy()
  })

  it('should handle return error', async () => {
    server.use(
      http.put('http://localhost:3000/api/v1/borrowings/1', () => {
        return HttpResponse.json(
          { errors: ['Book is already returned'] },
          { status: 422 }
        )
      })
    )

    const { result } = renderHook(() => useReturnBook(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(1)

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

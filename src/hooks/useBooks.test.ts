import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useBooks, useBook } from './useBooks'
import type { ReactNode } from 'react'

// Helper to create a wrapper with QueryClient
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return ({ children }: { children: ReactNode }) => {
    return QueryClientProvider({ client: queryClient, children })
  }
}

describe('useBooks', () => {
  it('fetches books successfully', async () => {
    const { result } = renderHook(() => useBooks(), {
      wrapper: createWrapper(),
    })

    // Initially loading
    expect(result.current.isLoading).toBe(true)

    // Wait for the query to succeed
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // Check the data
    expect(result.current.data).toBeDefined()
    expect(result.current.data?.books).toHaveLength(2)
    expect(result.current.data?.books[0].title).toBe('Clean Code')
  })

  it('fetches books with query parameters', async () => {
    const { result } = renderHook(
      () => useBooks({ query: 'Clean', page: 1, per_page: 10 }),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.pagination.per_page).toBe(10)
  })
})

describe('useBook', () => {
  it('fetches a single book successfully', async () => {
    const { result } = renderHook(() => useBook(1), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.book.id).toBe(1)
    expect(result.current.data?.book.title).toBe('Clean Code')
  })

  it('does not fetch when id is 0', () => {
    const { result } = renderHook(() => useBook(0), {
      wrapper: createWrapper(),
    })

    expect(result.current.fetchStatus).toBe('idle')
  })
})

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { borrowingsApi } from '@/api/borrowings'
import type { BorrowingsQueryParams, BorrowingFormData } from '@/types'
import { booksKeys } from './useBooks'

// Query keys
export const borrowingsKeys = {
  all: ['borrowings'] as const,
  lists: () => [...borrowingsKeys.all, 'list'] as const,
  list: (params?: BorrowingsQueryParams) =>
    [...borrowingsKeys.lists(), params] as const,
  details: () => [...borrowingsKeys.all, 'detail'] as const,
  detail: (id: number) => [...borrowingsKeys.details(), id] as const,
  overdue: () => [...borrowingsKeys.all, 'overdue'] as const,
}

// Fetch borrowings list
export function useBorrowings(params?: BorrowingsQueryParams) {
  return useQuery({
    queryKey: borrowingsKeys.list(params),
    queryFn: () => borrowingsApi.getBorrowings(params),
  })
}

// Fetch single borrowing
export function useBorrowing(id: number) {
  return useQuery({
    queryKey: borrowingsKeys.detail(id),
    queryFn: () => borrowingsApi.getBorrowing(id),
    enabled: !!id,
  })
}

// Fetch overdue borrowings
export function useOverdueBorrowings(params?: Pick<BorrowingsQueryParams, 'page' | 'per_page'>) {
  return useQuery({
    queryKey: [...borrowingsKeys.overdue(), params],
    queryFn: () => borrowingsApi.getOverdueBorrowings(params),
  })
}

// Borrow book mutation
export function useBorrowBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: BorrowingFormData) => borrowingsApi.borrowBook(data),
    onSuccess: () => {
      // Invalidate borrowings and books lists
      queryClient.invalidateQueries({ queryKey: borrowingsKeys.lists() })
      queryClient.invalidateQueries({ queryKey: booksKeys.lists() })
    },
  })
}

// Return book mutation
export function useReturnBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => borrowingsApi.returnBook(id),
    onSuccess: (_, borrowingId) => {
      // Invalidate specific borrowing, borrowings lists, and books lists
      queryClient.invalidateQueries({ queryKey: borrowingsKeys.detail(borrowingId) })
      queryClient.invalidateQueries({ queryKey: borrowingsKeys.lists() })
      queryClient.invalidateQueries({ queryKey: borrowingsKeys.overdue() })
      queryClient.invalidateQueries({ queryKey: booksKeys.lists() })
    },
  })
}

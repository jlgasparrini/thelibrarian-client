import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { booksApi } from '@/api/books'
import type { BooksQueryParams, BookFormData } from '@/types'

// Query keys
export const booksKeys = {
  all: ['books'] as const,
  lists: () => [...booksKeys.all, 'list'] as const,
  list: (params?: BooksQueryParams) => [...booksKeys.lists(), params] as const,
  details: () => [...booksKeys.all, 'detail'] as const,
  detail: (id: number) => [...booksKeys.details(), id] as const,
}

// Fetch books list with filters
export function useBooks(params?: BooksQueryParams) {
  return useQuery({
    queryKey: booksKeys.list(params),
    queryFn: () => booksApi.getBooks(params),
  })
}

// Fetch single book
export function useBook(id: number) {
  return useQuery({
    queryKey: booksKeys.detail(id),
    queryFn: () => booksApi.getBook(id),
    enabled: !!id,
  })
}

// Create book mutation (librarian only)
export function useCreateBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: BookFormData) => booksApi.createBook(data),
    onSuccess: () => {
      // Invalidate books list to refetch
      queryClient.invalidateQueries({ queryKey: booksKeys.lists() })
    },
  })
}

// Update book mutation (librarian only)
export function useUpdateBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BookFormData> }) =>
      booksApi.updateBook(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific book and lists
      queryClient.invalidateQueries({ queryKey: booksKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: booksKeys.lists() })
    },
  })
}

// Delete book mutation (librarian only)
export function useDeleteBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => booksApi.deleteBook(id),
    onSuccess: () => {
      // Invalidate books list
      queryClient.invalidateQueries({ queryKey: booksKeys.lists() })
    },
  })
}

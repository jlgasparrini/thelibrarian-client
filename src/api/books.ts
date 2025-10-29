import apiClient from './client'
import type {
  BooksResponse,
  BookResponse,
  BooksQueryParams,
  BookFormData,
} from '@/types'

export const booksApi = {
  getBooks: async (params?: BooksQueryParams): Promise<BooksResponse> => {
    const response = await apiClient.get('/books', { params })
    return response.data
  },

  getBook: async (id: number): Promise<BookResponse> => {
    const response = await apiClient.get(`/books/${id}`)
    return response.data
  },

  createBook: async (data: BookFormData): Promise<BookResponse> => {
    const response = await apiClient.post('/books', { book: data })
    return response.data
  },

  updateBook: async (
    id: number,
    data: Partial<BookFormData>
  ): Promise<BookResponse> => {
    const response = await apiClient.put(`/books/${id}`, { book: data })
    return response.data
  },

  deleteBook: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/books/${id}`)
    return response.data
  },
}

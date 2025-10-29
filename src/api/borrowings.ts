import apiClient from './client'
import type {
  BorrowingsResponse,
  BorrowingResponse,
  BorrowingsQueryParams,
  BorrowingFormData,
} from '@/types'

export const borrowingsApi = {
  getBorrowings: async (
    params?: BorrowingsQueryParams
  ): Promise<BorrowingsResponse> => {
    const response = await apiClient.get('/borrowings', { params })
    return response.data
  },

  getBorrowing: async (id: number): Promise<BorrowingResponse> => {
    const response = await apiClient.get(`/borrowings/${id}`)
    return response.data
  },

  borrowBook: async (data: BorrowingFormData): Promise<BorrowingResponse> => {
    const response = await apiClient.post('/borrowings', { borrowing: data })
    return response.data
  },

  returnBook: async (id: number): Promise<BorrowingResponse> => {
    const response = await apiClient.put(`/borrowings/${id}`, {
      action_type: 'return',
    })
    return response.data
  },

  getOverdueBorrowings: async (
    params?: Pick<BorrowingsQueryParams, 'page' | 'per_page'>
  ): Promise<BorrowingsResponse> => {
    const response = await apiClient.get('/borrowings/overdue', { params })
    return response.data
  },
}

import { useNavigate } from 'react-router-dom'
import { useCreateBook } from '@/hooks/useBooks'
import { BookForm } from '@/components/books/BookForm'
import { toast } from 'sonner'
import type { BookFormData } from '@/lib/validators'
import { ArrowLeft } from 'lucide-react'

export function CreateBookPage() {
  const navigate = useNavigate()
  const createMutation = useCreateBook()

  const handleSubmit = async (data: BookFormData) => {
    try {
      await createMutation.mutateAsync(data)
      toast.success('Book created successfully!')
      navigate('/books')
    } catch (error: unknown) {
      const err = error as { response?: { data?: { errors?: string[]; error?: string } } }
      const errorMessage =
        err?.response?.data?.errors?.join(', ') ||
        err?.response?.data?.error ||
        'Failed to create book'
      toast.error(errorMessage)
      throw error
    }
  }

  const handleCancel = () => {
    navigate('/books')
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/books')}
          className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Books
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Add New Book</h1>
        <p className="mt-1 text-sm text-gray-600">
          Fill in the details to add a new book to the library
        </p>
      </div>

      {/* Form */}
      <div className="rounded-lg bg-white p-6 shadow">
        <BookForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={createMutation.isPending}
        />
      </div>
    </div>
  )
}

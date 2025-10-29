import { useNavigate, useParams } from 'react-router-dom'
import { useBook, useUpdateBook } from '@/hooks/useBooks'
import { BookForm } from '@/components/books/BookForm'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { toast } from 'sonner'
import type { BookFormData } from '@/lib/validators'
import { ArrowLeft } from 'lucide-react'

export function EditBookPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useBook(Number(id))
  const updateMutation = useUpdateBook()

  const handleSubmit = async (formData: BookFormData) => {
    if (!id) return

    try {
      await updateMutation.mutateAsync({ id: Number(id), data: formData })
      toast.success('Book updated successfully!')
      navigate(`/books/${id}`)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { errors?: string[]; error?: string } } }
      const errorMessage =
        err?.response?.data?.errors?.join(', ') ||
        err?.response?.data?.error ||
        'Failed to update book'
      toast.error(errorMessage)
      throw error
    }
  }

  const handleCancel = () => {
    navigate(`/books/${id}`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isError || !data?.book) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <p className="text-sm text-red-800">Failed to load book data</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(`/books/${id}`)}
          className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Book Details
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Book</h1>
        <p className="mt-1 text-sm text-gray-600">
          Update the book information
        </p>
      </div>

      {/* Form */}
      <div className="rounded-lg bg-white p-6 shadow">
        <BookForm
          initialData={data.book}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={updateMutation.isPending}
        />
      </div>
    </div>
  )
}

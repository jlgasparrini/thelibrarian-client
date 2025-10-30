import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { AuthProvider } from './features/auth/AuthProvider'
import { ProtectedRoute } from './features/auth/ProtectedRoute'
import { MainLayout } from './layouts/MainLayout'
import { LoginPage } from './pages/auth/LoginPage'
import { SignupPage } from './pages/auth/SignupPage'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { BooksPage } from './pages/books/BooksPage'
import { BookDetailPage } from './pages/books/BookDetailPage'
import { CreateBookPage } from './pages/books/CreateBookPage'
import { EditBookPage } from './pages/books/EditBookPage'
import { MyBorrowingsPage } from './pages/borrowings/MyBorrowingsPage'
import { MyHistoryPage } from './pages/borrowings/MyHistoryPage'
import { AllBorrowingsPage } from './pages/borrowings/AllBorrowingsPage'
import { OverdueBorrowingsPage } from './pages/borrowings/OverdueBorrowingsPage'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Protected routes with layout */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <DashboardPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/books"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <BooksPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/books/new"
                element={
                  <ProtectedRoute requireRole="librarian">
                    <MainLayout>
                      <CreateBookPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/books/:id"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <BookDetailPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/books/:id/edit"
                element={
                  <ProtectedRoute requireRole="librarian">
                    <MainLayout>
                      <EditBookPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-borrowings"
                element={
                  <ProtectedRoute requireRole="member">
                    <MainLayout>
                      <MyBorrowingsPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-history"
                element={
                  <ProtectedRoute requireRole="member">
                    <MainLayout>
                      <MyHistoryPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/borrowings"
                element={
                  <ProtectedRoute requireRole="librarian">
                    <MainLayout>
                      <AllBorrowingsPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/borrowings/overdue"
                element={
                  <ProtectedRoute requireRole="librarian">
                    <MainLayout>
                      <OverdueBorrowingsPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App

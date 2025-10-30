# 🧭 Development Roadmap — Library Management Frontend (TDD)

This roadmap defines the sequence of development tasks to build the React frontend for the Library Management System, following the user stories from [USER_STORIES.md](./USER_STORIES.md).

Each step is self-contained and test-driven: implement → test → refactor → commit.

---

## 🎨 Step 1 — Project Setup & Configuration

**Goal:** Initialize the React project with all necessary tools and configurations.

- [x] Create Vite + React + TypeScript project
- [x] Install core dependencies:
  - `react-router-dom` - Routing
  - `@tanstack/react-query` - API state management
  - `axios` - HTTP client
  - `zustand` - Global state management
  - `react-hook-form` - Form handling
  - `zod` - Schema validation
- [x] Install UI dependencies:
  - `tailwindcss` - Styling
  - `lucide-react` - Icons
  - `sonner` - Toast notifications
- [x] Install dev dependencies:
  - `vitest` - Testing framework
  - `@testing-library/react` - Component testing
  - `@testing-library/jest-dom` - DOM matchers
  - `@testing-library/user-event` - User interaction testing
  - `msw` - API mocking
- [x] Configure Tailwind CSS
- [x] Configure path aliases (`@/` for src)
- [x] Configure Vitest
- [x] Create folder structure:
  ```
  src/
  ├── api/           # API client and endpoints
  ├── components/    # Reusable components
  ├── features/      # Feature-based modules
  ├── hooks/         # Custom hooks
  ├── layouts/       # Layout components
  ├── lib/           # Utilities and helpers
  ├── pages/         # Page components
  ├── stores/        # Zustand stores
  ├── types/         # TypeScript types
  └── test/          # Test utilities and mocks
  ```
- [x] Create `.env.example` with API URL
- [x] Setup ESLint and Prettier
- [x] Setup CI/CD:
  - GitHub Actions
  - Run tests on PR
  - Run linting
  - Build check
- [x] ✅ Run `npm run dev` → app loads successfully

---

## 🔌 Step 2 — API Client & Type Definitions

**Goal:** Set up API communication layer with type safety.

- [x] Create TypeScript types for API models:
  - `User` (id, email, role, created_at)
  - `Book` (id, title, author, genre, isbn, total_copies, available_copies, borrowings_count)
  - `Borrowing` (id, book, user, borrowed_at, due_date, returned_at, overdue)
  - `Dashboard` (librarian and member variants)
  - `PaginationMeta` (page, pages, count, per_page)
- [x] Create Axios instance with:
  - Base URL from environment
  - Request interceptor for JWT token
  - Response interceptor for error handling
  - Token refresh logic (optional)
- [x] Create API service modules:
  - `authApi.ts` - sign up, sign in, sign out, validate token
  - `booksApi.ts` - list, get, create, update, delete
  - `borrowingsApi.ts` - list, create, return, overdue
  - `dashboardApi.ts` - get dashboard data
- [x] Create React Query hooks:
  - `useBooks()` - fetch books with filters
  - `useBook(id)` - fetch single book
  - `useBorrowings()` - fetch borrowings
  - `useDashboard()` - fetch dashboard data
- [x] Write unit tests for API functions
- [x] Setup MSW for API mocking in tests
- [x] ✅ Test API calls with mock data

---

## 🔐 Step 3 — Authentication Flow

**Goal:** Implement complete authentication system with JWT.

- [x] Create auth store with Zustand:
  - State: `user`, `token`, `isAuthenticated`, `isLoading`
  - Actions: `login()`, `logout()`, `setUser()`, `checkAuth()`
- [x] Create auth hooks:
  - `useAuth()` - access auth state and actions
  - `useRequireAuth()` - redirect if not authenticated
  - `useRequireRole(role)` - redirect if wrong role
- [x] Create `<AuthProvider>` component:
  - Check for existing token on mount
  - Validate token with API
  - Set up axios interceptors
- [x] Create `<ProtectedRoute>` component:
  - Redirect to login if not authenticated
  - Show loading while checking auth
- [x] Create Login page (`/login`):
  - Email and password form
  - Form validation with Zod
  - Error handling
  - Redirect to dashboard on success
- [x] Create Signup page (`/signup`):
  - Email, password, password confirmation
  - Role selection (member only for signup)
  - Form validation
  - Redirect to login on success
- [x] Create logout functionality:
  - Clear token from storage
  - Clear user from state
  - Redirect to login
  - Call API sign out endpoint
- [x] Write tests:
  - Auth store actions
  - Login form submission
  - Signup form submission
  - Protected route redirects
- [x] ✅ Complete auth flow working (login → dashboard → logout)

---

## 🧭 Step 4 — Layout & Navigation

**Goal:** Create main layout with responsive navigation.

- [x] Create `<Layout>` component:
  - Header with navigation
  - Main content area
  - Footer (optional)
- [x] Create `<Navbar>` component:
  - Logo/brand
  - Navigation links (role-based)
  - User profile dropdown
  - Sign out button
  - Mobile hamburger menu
- [x] Create navigation structure:
  - Member: Dashboard, Books, My Borrowings, My History
  - Librarian: Dashboard, Books, All Borrowings, Manage Books
- [x] Create `<Sidebar>` component (optional):
  - Collapsible side navigation
  - Active page indicator
- [x] Add route configuration:
  - Public routes: `/`, `/login`, `/signup`
  - Protected routes: `/dashboard`, `/books`, etc.
  - Role-specific routes
- [x] Create `<LoadingSpinner>` component
- [x] Create `<ErrorBoundary>` component
- [x] Create toast notification system (Sonner)
- [x] Write tests:
  - Navigation renders correct links for each role
  - Mobile menu toggles
  - Active page highlighting
- [x] ✅ Navigation works for both roles

---

## 📚 Step 5 — Books List & Search

**Goal:** Display books with search, filter, and pagination.

- [x] Create `<BooksPage>` component:
  - Search bar
  - Filter panel
  - Books grid/list
  - Pagination controls
- [x] Create `<SearchBar>` component:
  - Debounced input
  - Clear button
  - Search icon
- [x] Create `<FilterPanel>` component:
  - Genre dropdown/select
  - Available checkbox
  - Sort dropdown
  - Clear filters button
- [x] Create `<BookCard>` component:
  - Book cover placeholder
  - Title, author, genre
  - Availability badge
  - View details button
  - Borrow button (if member and available)
- [x] Create `<Pagination>` component:
  - Previous/Next buttons
  - Page numbers
  - Items per page selector
- [x] Implement URL state management:
  - Search, filters, page in URL params
  - Shareable URLs
  - Browser back/forward support
- [x] Create `<BookDetailPage>` component:
  - Full book information
  - Availability status
  - Borrow button (if member)
  - Edit/Delete buttons (if librarian)
- [x] Add loading states
- [x] Add empty states (no books found)
- [x] Write tests:
  - Books render correctly
  - Search updates results
  - Filters work
  - Pagination works
- [x] ✅ Books list fully functional with search and filters

---

## 📖 Step 6 — Borrowing Flow (Member)

**Goal:** Allow members to borrow and return books.

- [x] Create `<BorrowButton>` component:
  - Disabled if not available
  - Disabled if already borrowed by user
  - Confirmation dialog
  - Optimistic update
  - Success/error toast
- [x] Create `<ReturnButton>` component:
  - Only for books borrowed by current user
  - Confirmation dialog
  - Optimistic update
  - Success/error toast
- [x] Create `<MyBorrowingsPage>` component:
  - List of active borrowings
  - Due date display
  - Days until due
  - Overdue highlighting
  - Return button
  - Filter by status (active/overdue)
- [x] Create `<MyHistoryPage>` component:
  - List of returned borrowings
  - Borrowed and returned dates
  - Pagination
- [x] Create `<BorrowingCard>` component:
  - Book information
  - Borrow date
  - Due date
  - Status badge (active, overdue, returned)
  - Return button (if active)
- [x] Implement borrow mutation:
  - API call
  - Optimistic update
  - Cache invalidation
  - Error handling
- [x] Implement return mutation:
  - API call
  - Optimistic update
  - Cache invalidation
  - Error handling
- [x] Write tests:
  - Borrow button works
  - Return button works
  - Overdue books highlighted
  - Can't borrow same book twice
- [x] ✅ Complete borrowing flow working

---

## 📊 Step 7 — Member Dashboard

**Goal:** Display member's borrowing summary and quick actions.

- [x] Create `<MemberDashboard>` component:
  - Statistics cards
  - Active borrowings list
  - Books due soon
  - Quick actions
- [x] Create `<StatCard>` component:
  - Icon
  - Label
  - Value
  - Color coding (red for overdue, yellow for due soon)
- [x] Create `<QuickActions>` component:
  - Browse books button
  - View all borrowings button
  - View history button
- [x] Display metrics:
  - Active borrowings count
  - Overdue borrowings count
  - Books due soon count
- [x] Display active borrowings:
  - Show next 5 borrowings
  - Link to view all
- [x] Add auto-refresh option
- [x] Write tests:
  - Dashboard renders correct data
  - Stats cards show correct values
  - Quick actions navigate correctly
- [x] ✅ Member dashboard complete

---

## 🛠️ Step 8 — Book Management (Librarian)

**Goal:** Allow librarians to create, edit, and delete books.

- [x] Create `<BookForm>` component:
  - Title input (required)
  - Author input (required)
  - Genre select (required)
  - ISBN input (required, validated)
  - Total copies number input (required, min 0)
  - Available copies number input (required, min 0, max total_copies)
  - Form validation with Zod
  - Submit button
  - Cancel button
- [x] Create `<CreateBookPage>` component:
  - Page title
  - BookForm with empty initial values
  - Success redirect to books list
- [x] Create `<EditBookPage>` component:
  - Load existing book data
  - BookForm with pre-filled values
  - Success redirect to book detail
- [x] Create `<DeleteButton>` component:
  - Confirmation dialog
  - Delete mutation
  - Success redirect to books list
- [x] Implement mutations:
  - Create book
  - Update book
  - Delete book
  - Cache invalidation
  - Optimistic updates
- [x] Add validation:
  - ISBN format (10 or 13 digits)
  - Available copies <= total copies
  - All required fields
- [x] Write tests:
  - Form validation works
  - Create book succeeds
  - Edit book succeeds
  - Delete book succeeds
  - Validation errors shown
- [x] ✅ Book management complete

---

## 📊 Step 9 — Librarian Dashboard

**Goal:** Display library-wide statistics and insights.

- [x] Create `<LibrarianDashboard>` component:
  - Statistics grid
  - Recent borrowings table
  - Popular books list
  - Overdue borrowings list
- [x] Create `<LibraryStats>` component:
  - Total books
  - Total available books
  - Total borrowed books
  - Books due today
  - Overdue books
  - Total members
  - Members with overdue books
- [x] Create `<RecentActivity>` component:
  - Table of recent borrowings
  - Member email
  - Book title
  - Borrowed date
  - Link to borrowing details
- [x] Create `<PopularBooks>` component:
  - List of top 10 books by borrow count
  - Book title and author
  - Borrow count
  - Link to book details
- [x] Create `<OverdueList>` component:
  - Table of overdue borrowings
  - Member email
  - Book title
  - Due date
  - Days overdue
  - Return button
- [x] Add auto-refresh option (every 30 seconds)
- [x] Write tests:
  - Dashboard renders all sections
  - Stats show correct values
  - Tables display data correctly
- [x] ✅ Librarian dashboard complete

---

## 📋 Step 10 — Borrowing Management (Librarian)

**Goal:** Allow librarians to view and manage all borrowings.

- [ ] Create `<AllBorrowingsPage>` component:
  - Filter tabs (all, active, returned, overdue)
  - Search bar (by member or book)
  - Borrowings table
  - Pagination
- [ ] Create `<BorrowingTable>` component:
  - Member email column
  - Book title column
  - Borrowed date column
  - Due date column
  - Status column (badge)
  - Actions column (return button if active)
  - Sortable columns
- [ ] Create `<StatusBadge>` component:
  - Color-coded by status
  - Active (blue)
  - Returned (green)
  - Overdue (red)
- [ ] Create `<OverdueBorrowingsPage>` component:
  - Dedicated page for overdue items
  - Sorted by most overdue first
  - Member contact information
  - Return button
- [ ] Implement return action for librarians:
  - Can return any book
  - Confirmation dialog
  - Success toast
- [ ] Add filters:
  - By status
  - By date range
  - By member
  - By book
- [ ] Write tests:
  - Borrowings table renders
  - Filters work
  - Return action works
  - Status badges show correct colors
- [ ] ✅ Borrowing management complete

---

## 🎨 Step 11 — UI/UX Polish

**Goal:** Improve user experience and visual design.

- [ ] Add loading skeletons:
  - Book cards skeleton
  - Table rows skeleton
  - Dashboard stats skeleton
- [ ] Add empty states:
  - No books found
  - No borrowings
  - No search results
- [ ] Add error states:
  - API error messages
  - Network error handling
  - 404 page
  - 403 forbidden page
- [ ] Improve form UX:
  - Inline validation
  - Field-level error messages
  - Disabled submit while loading
  - Success feedback
- [ ] Add animations:
  - Page transitions
  - Card hover effects
  - Button interactions
  - Toast animations
- [ ] Improve accessibility:
  - ARIA labels
  - Keyboard navigation
  - Focus management
  - Screen reader support
- [ ] Add responsive design:
  - Mobile-first approach
  - Tablet breakpoints
  - Desktop optimization
  - Touch-friendly buttons
- [ ] Add dark mode (optional):
  - Theme toggle
  - Persistent preference
  - System preference detection
- [ ] Write accessibility tests
- [ ] ✅ UI/UX polished and accessible

---

## 🧪 Step 12 — Testing & Quality Assurance

**Goal:** Ensure code quality and test coverage.

- [ ] Write unit tests:
  - Utility functions (100% coverage)
  - Custom hooks (100% coverage)
  - Form validation logic
- [ ] Write component tests:
  - All major components
  - User interactions
  - Conditional rendering
  - Props variations
- [ ] Write integration tests:
  - Authentication flow
  - Book browsing flow
  - Borrowing flow (member)
  - Book management flow (librarian)
  - Dashboard data loading
- [ ] Setup E2E tests (optional):
  - Playwright or Cypress
  - Critical user journeys
- [ ] Add test coverage reporting:
  - Vitest coverage
  - Target: >80% coverage
- [ ] Code quality checks:
  - ESLint rules
  - Prettier formatting
  - TypeScript strict mode
- [ ] ✅ All tests passing, >80% coverage

---

## 🚀 Step 13 — Deployment & Documentation

**Goal:** Deploy to production and document the project.

- [ ] Prepare for deployment:
  - Environment variables setup
  - Build optimization
  - Asset optimization
  - Error tracking (Sentry optional)
- [ ] Deploy to Vercel/Netlify:
  - Connect GitHub repo
  - Configure build settings
  - Set environment variables
  - Custom domain (optional)
- [ ] Update README.md:
  - Project description
  - Features list
  - Tech stack
  - Setup instructions
  - Environment variables
  - Deployment guide
- [ ] Create API_INTEGRATION.md:
  - Backend API endpoints used
  - Authentication flow
  - Error handling
  - Type definitions
- [ ] Create TESTING.md:
  - Testing strategy
  - Running tests
  - Writing new tests
  - Coverage reports
- [ ] Create CONTRIBUTING.md (optional):
  - Code style guide
  - Git workflow
  - PR template
- [ ] Add screenshots to README
- [ ] ✅ App deployed and documented

---

## 🎯 Step 14 — Performance Optimization (Optional)

**Goal:** Optimize for production performance.

- [ ] Code splitting:
  - Lazy load routes
  - Lazy load heavy components
  - Dynamic imports
- [ ] Bundle optimization:
  - Analyze bundle size
  - Remove unused dependencies
  - Tree shaking
- [ ] Image optimization:
  - Lazy loading images
  - WebP format
  - Responsive images
- [ ] Caching strategy:
  - React Query cache configuration
  - Service worker (optional)
  - Static asset caching
- [ ] Performance monitoring:
  - Lighthouse scores
  - Core Web Vitals
  - Performance budgets
- [ ] Accessibility audit:
  - WAVE tool
  - axe DevTools
  - Manual testing
- [ ] ✅ Performance optimized (Lighthouse >90)

---

## 📈 Summary

**Total Steps:** 14
**Estimated Timeline:** 3-4 weeks (part-time)
**Testing Approach:** TDD throughout
**Deployment:** Vercel/Netlify
**Backend Integration:** Full API integration

**Priority Order:**
1. Setup & API client (foundation)
2. Authentication (required for all features)
3. Layout & navigation (user experience)
4. Books list (core feature)
5. Borrowing flow (core feature)
6. Member dashboard (user value)
7. Book management (admin feature)
8. Librarian dashboard (admin value)
9. Borrowing management (admin feature)
10. UI/UX polish (quality)
11. Testing (quality assurance)
12. Deployment (production)
13. Performance (optimization)

**Success Criteria:**
- ✅ All user stories implemented
- ✅ >80% test coverage
- ✅ Lighthouse score >90
- ✅ Responsive on all devices
- ✅ Accessible (WCAG 2.1 AA)
- ✅ Deployed to production
- ✅ Full backend integration

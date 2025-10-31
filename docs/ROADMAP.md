# 🧭 Development Roadmap — Library Management

This roadmap defines the sequence of development tasks to build the React frontend for the Library Management System, following the user stories from [USER_STORIES.md](./USER_STORIES.md).

---

## 🎨 Step 1 — Project Setup & Configuration

**Goal:** Initialize the React project with all necessary tools and configurations.

- [x] Create Vite + React + TypeScript project
- [x] Install core dependencies
- [x] Install UI dependencies
- [x] Install dev dependencies
- [x] Configure Tailwind CSS
- [x] Configure Vitest
- [x] Setup ESLint and Prettier
- [x] Setup CI/CD
- [x] ✅ Run `npm run dev` → app loads successfully

---

## 🔌 Step 2 — API Client & Type Definitions

**Goal:** Set up API communication layer with type safety.

- [x] Create TypeScript types for API models
- [x] Create Axios instance with
- [x] Create API service modules:
  - `authApi.ts` - sign up, sign in, sign out, validate token
  - `booksApi.ts` - list, get, create, update, delete
  - `borrowingsApi.ts` - list, create, return, overdue
  - `dashboardApi.ts` - get dashboard data
- [x] Create React Query hooks
- [x] Write unit tests for API functions
- [x] ✅ Test API calls with mock data

---

## 🔐 Step 3 — Authentication Flow

**Goal:** Implement complete authentication system with JWT.

- [x] Create auth store with Zustand:
  - State: `user`, `token`, `isAuthenticated`, `isLoading`
  - Actions: `login()`, `logout()`, `setUser()`, `checkAuth()`
- [x] Create auth hooks
- [x] Create `<AuthProvider>`, `<ProtectedRoute>` components
- [x] Create Login, Signup pages with form validation and error handling
- [x] Write tests
- [x] ✅ Complete auth flow working (login → dashboard → logout)

---

## 🧭 Step 4 — Layout & Navigation

**Goal:** Create main layout with responsive navigation.

- [x] Create `<Layout>`, `<Navbar>` and `<Sidebar>` components
- [x] Create navigation structure and routes
- [x] Create `<LoadingSpinner>` and `<ErrorBoundary>` components
- [x] Add toast notifications
- [x] Write tests
- [x] ✅ Navigation works for both roles

---

## 📚 Step 5 — Books List & Search

**Goal:** Display books with search, filter, and pagination.

- [x] Create `<BooksPage>`, `<BookCard>` and `<BookDetailPage>` components
- [x] Add empty and loading states
- [x] Write tests
- [x] ✅ Books list fully functional with search and filters

---

## 📖 Step 6 — Borrowing Flow (Member)

**Goal:** Allow members to borrow and return books.

- [x] Create `<MyBorrowingsPage>` and `<BorrowingCard>` components
- [x] Add Borrow and Return buttons
- [x] Implement borrow and return mutations
- [x] Write tests
- [x] ✅ Complete borrowing flow working

---

## 📊 Step 7 — Member Dashboard

**Goal:** Display member's borrowing summary and quick actions.

- [x] Create `<MemberDashboard>` and `<StatCard>` components
- [x] Display metrics and active borrowings
- [x] Add auto-refresh option
- [x] Write tests
- [x] ✅ Member dashboard complete

---

## 🛠️ Step 8 — Book Management (Librarian)

**Goal:** Allow librarians to create, edit, and delete books.

- [x] Create `<BookForm>` component:
- [x] Create `<CreateBookPage>` component:
- [x] Create `<EditBookPage>` component:
- [x] Create `<DeleteButton>` component:
- [x] Implement mutations:
- [x] Add validation:
- [x] Write tests:
- [x] ✅ Book management complete

---

## 📊 Step 9 — Librarian Dashboard

**Goal:** Display library-wide statistics and insights.

- [x] Create `<LibrarianDashboard>` component:
- [x] Create `<LibraryStats>` component:
- [x] Create `<RecentActivity>` component:
- [x] Create `<PopularBooks>` component:
- [x] Create `<OverdueList>` component:
- [x] Add auto-refresh option (every 30 seconds)
- [x] Write tests:
- [x] ✅ Librarian dashboard complete

---

## 📋 Step 10 — Borrowing Management (Librarian)

**Goal:** Allow librarians to view and manage all borrowings.

- [x] Create `<AllBorrowingsPage>` component:
- [x] Create `<BorrowingTable>` component:
- [x] Create `<StatusBadge>` component:
- [x] Create `<OverdueBorrowingsPage>` component:
- [x] Implement return action for librarians:
- [x] Add filters:
- [x] Write tests:
- [x] ✅ Borrowing management complete

---

## 🎨 Step 11 — UI/UX Polish

**Goal:** Improve user experience and visual design.

- [x] Add Book, Table, Dashboard and Borrowing cards skeletons
- [x] Add error states (API error, 404, 403)
- [x] Improve form UX with field-level error handling
- [x] Add responsive design (mobile-first using Tailwind)
- [x] Write accessibility tests
- [x] ✅ UI/UX polished and accessible

---

## 🧪 Step 12 — Deployment, Testing & Quality Assurance

**Goal:** Ensure code quality and test coverage.

- [x] Write some unit, component and integration tests
- [x] Add test coverage reporting
- [x] Prepare for deployment to Vercel
- [x] ✅ All tests passing, >60% coverage

---

## Technical Debt (or desired features)

- [ ] Add images to books:
  - Lazy loading images, WebP format, responsive images
- [ ] Add dark mode:
  - Theme toggle, persistent preference
- [ ] Internationalization - i18n:
  - Language selection, system language detection
- [ ] Add animations:
  - Page transitions, card hover effects, toast animations
- [ ] Performance monitoring:
  - Review Lighthouse scores
- [ ] ✅ Performance optimized (Lighthouse >90)

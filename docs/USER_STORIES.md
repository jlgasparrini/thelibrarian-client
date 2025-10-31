# 📚 Frontend User Stories - Library Management System

## 🔐 Authentication & Authorization

### As a Visitor
- [ ] I want to see a landing page explaining the library system
- [ ] I want to sign up as a new member with email and password
- [ ] I want to sign in with my credentials
- [ ] I want to see clear error messages if login fails

### As an Authenticated User
- [ ] I want to see my role (Member/Librarian) in the navigation
- [ ] I want to sign out from any page
- [ ] I want my session to persist across page refreshes
- [ ] I want to be redirected to login if my token expires

**Acceptance Criteria:**
- JWT token stored securely in localStorage
- Protected routes redirect to login if not authenticated
- Token sent in Authorization header for all API requests
- Clear visual feedback for auth state (loading, error, success)

---

## 📚 Book Browsing & Search

### As any Authenticated User
- [ ] I want to see a list of all books with pagination
- [ ] I want to search books by title, author, or ISBN
- [ ] I want to filter books by genre
- [ ] I want to filter to show only available books
- [ ] I want to sort books by title, author, or date added
- [ ] I want to see book details (title, author, genre, ISBN, availability)
- [ ] I want to see how many copies are available
- [ ] I want responsive design that works on mobile

**Acceptance Criteria:**
- Books list shows 25 items per page (configurable)
- Search updates results in real-time or on submit
- Filters can be combined (search + genre + available)
- Clear indication of available vs unavailable books
- Pagination controls (prev, next, page numbers)
- Loading states while fetching data
- Empty state when no books match filters

---

## 📖 Borrowing Books (Member Role)

### As a Member
- [ ] I want to borrow an available book with one click
- [ ] I want to see my active borrowings with due dates
- [ ] I want to see which books are overdue (highlighted)
- [ ] I want to return a book I've borrowed
- [ ] I want to see my borrowing history
- [ ] I want to see how many days until a book is due
- [ ] I want to be prevented from borrowing the same book twice
- [ ] I want to see a warning if I try to borrow an unavailable book

**Acceptance Criteria:**
- Borrow button only visible for available books
- Borrow button disabled if already borrowed by current user
- Confirmation dialog before borrowing
- Success/error messages after borrow/return actions
- Overdue books highlighted in red
- Books due soon (within 3 days) highlighted in yellow
- Return button only on books borrowed by current user

---

## 📊 Member Dashboard

### As a Member
- [ ] I want to see a dashboard with my borrowing summary
- [ ] I want to see count of active borrowings
- [ ] I want to see count of overdue books
- [ ] I want to see books due soon
- [ ] I want quick links to my borrowings and history
- [ ] I want to see recent activity

**Acceptance Criteria:**
- Dashboard shows key metrics at a glance
- Visual indicators for overdue (red) and due soon (yellow)
- Quick actions to view details or return books
- Responsive cards layout

---

## 📚 Book Management (Librarian Role)

### As a Librarian
- [ ] I want to see all books with management actions
- [ ] I want to create a new book with all details
- [ ] I want to edit book details (title, author, genre, ISBN, copies)
- [ ] I want to delete a book (with confirmation)
- [ ] I want to see validation errors when creating/editing
- [ ] I want to see success messages after actions

**Acceptance Criteria:**
- Create/Edit forms with validation
- ISBN format validation
- Total copies must be >= available copies
- Confirmation dialog before delete
- Form shows existing data when editing
- Clear error messages for validation failures

---

## 📊 Librarian Dashboard

### As a Librarian
- [ ] I want to see library-wide statistics
- [ ] I want to see total books count
- [ ] I want to see total borrowed books
- [ ] I want to see books due today
- [ ] I want to see overdue books count
- [ ] I want to see total members count
- [ ] I want to see members with overdue books
- [ ] I want to see recent borrowings list
- [ ] I want to see popular books
- [ ] I want to see overdue borrowings with member details

**Acceptance Criteria:**
- Dashboard shows comprehensive library metrics
- Recent borrowings show last 10 transactions
- Popular books ranked by borrow count
- Overdue borrowings show member email and book title
- Click on items to see details
- Auto-refresh option for real-time updates

---

## 📋 Borrowing Management (Librarian Role)

### As a Librarian
- [ ] I want to see all borrowings (not just mine)
- [ ] I want to filter borrowings by status (active, returned, overdue)
- [ ] I want to see member details for each borrowing
- [ ] I want to mark any borrowing as returned
- [ ] I want to see overdue borrowings prominently
- [ ] I want to search borrowings by member or book

**Acceptance Criteria:**
- Borrowings list shows member email and book title
- Status badges (active, returned, overdue)
- Return button for active borrowings
- Filter tabs for different statuses
- Search by member email or book title
- Pagination for large lists

---

## 👥 User Management (Librarian Role - Optional)

### As a Librarian
- [ ] I want to see a list of all members
- [ ] I want to see member borrowing statistics
- [ ] I want to search members by email
- [ ] I want to see which members have overdue books

**Acceptance Criteria:**
- Members list with email and stats
- Click member to see their borrowing history
- Highlight members with overdue books
- Search by email

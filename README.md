# 📚 Library Management System - Frontend

A modern, responsive React frontend for the Library Management System, featuring role-based dashboards, book browsing, and borrowing workflows — all built with TypeScript and test-driven development (TDD).

[![React](https://img.shields.io/badge/react-19.2-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.5-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/vite-5.4-purple)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/tailwind-3.4-cyan)](https://tailwindcss.com/)

---

## 🎯 Overview

This is the frontend application for a library management system that supports two user roles:
- **Members** - Browse books, borrow/return items, track due dates
- **Librarians** - Manage books, track all borrowings, view library analytics

Built with modern React patterns, TypeScript for type safety, and comprehensive test coverage.

---

## 📚 Documentation

- 📘 [User Stories](./USER_STORIES.md) - Feature requirements and user flows
- 🧱 [Development Roadmap](./ROADMAP.md) - Step-by-step development guide

---

## ⚙️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 19.x + Vite |
| **Language** | TypeScript 5.x |
| **Routing** | React Router v6 |
| **State Management** | Zustand (global) + React Query (server) |
| **Forms** | React Hook Form + Zod |
| **Styling** | Tailwind CSS |
| **UI Components** | Custom + shadcn/ui patterns |
| **Icons** | Lucide React |
| **HTTP Client** | Axios |
| **Testing** | Vitest + React Testing Library |
| **API Mocking** | MSW (Mock Service Worker) |
| **Deployment** | Vercel / Netlify |

---

## 🚀 Quick Start

### Prerequisites

- Node.js lts/krypton -> v24.11.0
- Backend API running (see [thelibrarian-api](https://github.com/jlgasparrini/thelibrarian-api))

### Installation

```bash
# Clone the repository
git clone https://github.com/jlgasparrini/thelibrarian-web.git
cd thelibrarian-web

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env and set VITE_API_URL=http://localhost:3000

# Start development server
npm run dev
```

### Available Scripts

```bash
# Development
npm run dev              # Start dev server (http://localhost:5173)
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm run test             # Run tests in watch mode
npm run test:ui          # Run tests with UI
npm run test:coverage    # Generate coverage report

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run format           # Format code with Prettier
npm run type-check       # Run TypeScript compiler check
```

---

## 🎯 Features

### ✅ Implemented

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | JWT-based login/signup with role-based access |
| 📚 **Book Browsing** | Search, filter, sort, and paginate books |
| 🔍 **Advanced Search** | Search by title, author, ISBN with real-time results |
| 📖 **Borrowing System** | Borrow and return books with due date tracking |
| ⏰ **Overdue Tracking** | Visual indicators for overdue and due-soon books |
| 📊 **Member Dashboard** | Personal borrowing stats and quick actions |
| 📈 **Librarian Dashboard** | Library-wide analytics and insights |
| 🛠️ **Book Management** | Full CRUD operations for librarians |
| 📋 **Borrowing Management** | View and manage all borrowings (librarians) |
| 📱 **Responsive Design** | Mobile-first, works on all devices |
| 🎨 **Modern UI** | Clean, intuitive interface with Tailwind CSS |
| ♿ **Accessible** | WCAG 2.1 AA compliant |
| 🧪 **Well Tested** | Comprehensive test coverage with Vitest |

### 🔮 Planned

- 🌙 Dark mode support
- 📧 Email notifications for due dates
- 📖 Reading lists and favorites
- 🔔 Real-time notifications
- 📊 Advanced analytics and reports
- 🌐 Internationalization (i18n)

---

## 🏗️ Project Structure

```
src/
├── api/                    # API client and endpoints
│   ├── client.ts          # Axios instance configuration
│   ├── auth.ts            # Authentication endpoints
│   ├── books.ts           # Books endpoints
│   ├── borrowings.ts      # Borrowings endpoints
│   └── dashboard.ts       # Dashboard endpoints
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── books/            # Book-related components
│   ├── borrowings/       # Borrowing-related components
│   └── layout/           # Layout components
├── features/             # Feature-based modules
│   ├── auth/            # Authentication feature
│   ├── books/           # Books feature
│   ├── borrowings/      # Borrowings feature
│   └── dashboard/       # Dashboard feature
├── hooks/                # Custom React hooks
│   ├── useAuth.ts       # Authentication hook
│   ├── useBooks.ts      # Books data hook
│   └── useBorrowings.ts # Borrowings data hook
├── layouts/              # Page layouts
│   ├── MainLayout.tsx   # Main app layout
│   └── AuthLayout.tsx   # Auth pages layout
├── lib/                  # Utilities and helpers
│   ├── utils.ts         # General utilities
│   ├── constants.ts     # App constants
│   └── validators.ts    # Validation schemas
├── pages/                # Page components
│   ├── auth/            # Auth pages
│   ├── books/           # Book pages
│   ├── borrowings/      # Borrowing pages
│   └── dashboard/       # Dashboard pages
├── stores/               # Zustand stores
│   └── authStore.ts     # Auth state management
├── types/                # TypeScript type definitions
│   ├── api.ts           # API response types
│   ├── models.ts        # Domain models
│   └── index.ts         # Exported types
└── test/                 # Test utilities
    ├── setup.ts         # Test setup
    ├── mocks/           # MSW handlers
    └── utils.tsx        # Test helpers
```

---

## 🔌 API Integration

### Backend Requirements

This frontend requires the [Library Management API](https://github.com/jlgasparrini/thelibrarian-api) backend.

**Backend endpoints used:**
- `POST /api/v1/auth/sign_up` - User registration
- `POST /api/v1/auth/sign_in` - User login
- `DELETE /api/v1/auth/sign_out` - User logout
- `GET /api/v1/books` - List books (with search, filter, pagination)
- `GET /api/v1/books/:id` - Get book details
- `POST /api/v1/books` - Create book (librarian)
- `PUT /api/v1/books/:id` - Update book (librarian)
- `DELETE /api/v1/books/:id` - Delete book (librarian)
- `GET /api/v1/borrowings` - List borrowings
- `POST /api/v1/borrowings` - Borrow book
- `PUT /api/v1/borrowings/:id` - Return book
- `GET /api/v1/borrowings/overdue` - List overdue borrowings
- `GET /api/v1/dashboard` - Get dashboard data

### Environment Variables

```bash
# .env
VITE_API_URL=http://localhost:3000  # Backend API URL
```

### CORS Configuration

Ensure your backend allows requests from the frontend origin:

```ruby
# Backend: config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:5173'  # Vite dev server
    
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      expose: ['Authorization']
  end
end
```

---

## 🧪 Testing

### Test Coverage Goals

- **Unit Tests:** >90% coverage
- **Component Tests:** All major components
- **Integration Tests:** Critical user flows
- **E2E Tests:** Key user journeys (optional)

### Running Tests

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test src/components/BookCard.test.tsx
```

### Testing Strategy

1. **Unit Tests** - Utility functions, hooks, validation logic
2. **Component Tests** - UI components with React Testing Library
3. **Integration Tests** - Feature flows with MSW for API mocking
4. **E2E Tests** - Critical paths with Playwright (optional)

### Example Test

```typescript
import { render, screen } from '@testing-library/react';
import { BookCard } from './BookCard';

describe('BookCard', () => {
  it('renders book information correctly', () => {
    const book = {
      id: 1,
      title: 'Clean Code',
      author: 'Robert Martin',
      available_copies: 3
    };
    
    render(<BookCard book={book} />);
    
    expect(screen.getByText('Clean Code')).toBeInTheDocument();
    expect(screen.getByText('Robert Martin')).toBeInTheDocument();
    expect(screen.getByText('3 available')).toBeInTheDocument();
  });
});
```

---

## 🎨 UI/UX Guidelines

### Design Principles

- **Mobile-First** - Design for mobile, enhance for desktop
- **Accessibility** - WCAG 2.1 AA compliance
- **Performance** - Fast loading, smooth interactions
- **Consistency** - Reusable components, consistent patterns
- **Feedback** - Clear loading states, error messages, success confirmations

### Color Scheme

```css
/* Primary Colors */
--primary: 222.2 47.4% 11.2%;      /* Dark blue */
--primary-foreground: 210 40% 98%; /* Light text */

/* Status Colors */
--success: 142 76% 36%;            /* Green */
--warning: 38 92% 50%;             /* Yellow */
--error: 0 84% 60%;                /* Red */
--info: 221 83% 53%;               /* Blue */
```

### Typography

- **Headings:** Inter font family
- **Body:** Inter font family
- **Code:** JetBrains Mono

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Production deployment
netlify deploy --prod
```

### Build Configuration

```json
{
  "build": {
    "command": "npm run build",
    "output": "dist"
  },
  "env": {
    "VITE_API_URL": "https://your-api-url.com"
  }
}
```

---

## 📈 Performance

### Optimization Techniques

- ✅ **Code Splitting** - Lazy load routes and heavy components
- ✅ **Bundle Optimization** - Tree shaking, minification
- ✅ **Image Optimization** - Lazy loading, WebP format
- ✅ **Caching** - React Query cache, service worker
- ✅ **Debouncing** - Search input, API calls

### Performance Targets

- **First Contentful Paint:** <1.5s
- **Time to Interactive:** <3s
- **Lighthouse Score:** >90
- **Bundle Size:** <200KB (gzipped)

---

## 🤝 Contributing

### Development Workflow

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes with tests
3. Run tests: `npm run test`
4. Run linting: `npm run lint`
5. Commit: `git commit -m "feat: add my feature"`
6. Push: `git push origin feature/my-feature`
7. Create Pull Request

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build/tooling changes

---

## 🏁 Project Status

### ✅ Completed

- Project setup and configuration
- API client and type definitions
- Authentication flow
- Layout and navigation
- Books list with search and filters
- Borrowing flow (member)
- Member dashboard
- Book management (librarian)
- Librarian dashboard
- Borrowing management (librarian)

### 🚧 In Progress

- UI/UX polish
- Comprehensive testing
- Performance optimization

### 📋 Backlog

- Dark mode
- Email notifications
- Advanced analytics
- Internationalization

---

## 👤 Author

**Leonel Gasparrini**  
Full Stack Developer  
🇦🇷 Argentina

- [GitHub](https://github.com/jlgasparrini)
- [LinkedIn](https://linkedin.com/in/jlgasparrini/)

---

## 📄 License

This project is available for portfolio and educational purposes.

---

## 🙏 Acknowledgments

Built with:
- React and the amazing React ecosystem
- Vite for blazing fast development
- Tailwind CSS for utility-first styling
- TypeScript for type safety
- Vitest for delightful testing
- Test-Driven Development methodology

---

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check the [backend API documentation](https://github.com/jlgasparrini/thelibrarian-api)
- Review the [USER_STORIES.md](./USER_STORIES.md) for feature details

---

**Happy coding! 🚀**

# 📚 Library Management System - Frontend

A modern, responsive React frontend for the Library Management System, featuring role-based dashboards, book browsing, and borrowing workflows — all built with TypeScript.

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
| **Deployment** | Vercel |

---

## 🎯 Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | JWT-based login/signup with role-based access |
| 📚 **Book Browsing** | Search, filter, sort, and paginate books |
| 🔍 **Advanced Search** | Search by title, author, ISBN with real-time results |
| 📖 **Borrowing System** | Borrow and return books with due date tracking |
| ⏰ **Overdue Tracking** | Visual indicators for overdue and due-soon books |
| 📊 **Member Dashboard** | Personal borrowing stats |
| 📈 **Librarian Dashboard** | Library-wide analytics and insights |
| 🛠️ **Book Management** | Full CRUD operations for librarians |
| 📱 **Responsive Design** | Mobile-first, works on all devices |

---

## 🚀 Quick Start

### Prerequisites

- Node.js lts/krypton -> v24.11.0

### Installation

```bash
# Clone the repository
git clone https://github.com/jlgasparrini/thelibrarian-client.git
cd thelibrarian-client

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
npm run type-check       # Run TypeScript compiler check
```

---

## 🔌 API Integration

This frontend requires the [Library Management API](https://github.com/jlgasparrini/thelibrarian-api) backend.

**Production API:** https://thelibrarian-api.onrender.com

### Environment Variables

```bash
# .env
VITE_API_URL=http://localhost:3000  # Backend API URL
```

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

---

## 📈 Performance

### Optimization Techniques

- ✅ **Code Splitting** - Lazy load routes and heavy components
- ✅ **Bundle Optimization** - Tree shaking, minification
- ✅ **Caching** - React Query cache, service worker
- ✅ **Debouncing** - Search input, API calls

---

## 👤 Author

**Leonel Gasparrini**  
Full Stack Developer  
🇦🇷 Argentina

- [GitHub](https://github.com/jlgasparrini)
- [LinkedIn](https://linkedin.com/in/jlgasparrini/)

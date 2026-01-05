# Dev Blog Platform

A developer blogging platform built with Next.js, demonstrating authentication, authorization, and content management patterns.

## Overview

This is an application that allows developers to write and publish articles in Markdown, manage drafts, and share knowledge with the community. The platform focuses on correctness, security, and clean system design—similar to platforms like Hashnode or Dev.to, but intentionally scoped to core blogging features.

**Key Features:**

- 🔐 Secure authentication with HTTP-only JWT cookies
- ✍️ Markdown-based article creation and editing
- 📝 Draft and publish workflow
- 🔍 Full-text search and tag filtering
- 👤 Public user profiles
- 📱 Server-side rendering for SEO

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (HTTP-only cookies)
- **Styling:** Tailwind CSS + ShadCN UI
- **Password Hashing:** bcrypt
- **Markdown Rendering:** react-markdown

## Architecture

This application uses **Next.js Server Actions** exclusively—no REST APIs. All data mutations and queries are handled server-side through typed actions.

```
User → Browser → Next.js (RSC/Forms) → Server Actions → Prisma → PostgreSQL
```

### Key Design Decisions

- **Server Actions over REST**: Eliminates API boilerplate while maintaining type safety
- **Server Components**: Article feeds and reading pages use RSC for optimal SEO
- **Client Components**: Forms and interactive features use client-side rendering
- **Cookie-based Auth**: Secure, HTTP-only JWT tokens prevent XSS attacks

## Project Structure

```
/app
  /(auth)
    /login/page.tsx           # Login page
    /register/page.tsx        # Registration page
  /articles
    page.tsx                  # Global feed (Server Component)
    /new/page.tsx            # Create article
    /[slug]/page.tsx         # Read article (Server Component)
    /[slug]/edit/page.tsx    # Edit article
  /profile
    /[username]/page.tsx     # User profile (Server Component)
/actions
  auth.ts                     # Authentication actions
  article.ts                  # Article CRUD actions
  query.ts                    # Data fetching actions
/lib
  auth.ts                     # JWT utilities
  prisma.ts                   # Prisma client
  markdown.ts                 # Markdown utilities
/middleware.ts                # Auth middleware
/prisma
  schema.prisma              # Database schema
```

## Database Schema

```prisma
User
  - id, email, username, password, bio
  - articles (relation)

Article
  - id, title, slug, body, status (DRAFT/PUBLISHED)
  - author (relation)
  - tags (many-to-many)
  - timestamps

Tag
  - id, name
  - articles (many-to-many)

ArticleTag (join table)
  - articleId, tagId
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd dev-blog-platform
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Configure your `.env`:

   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/devblog"
   JWT_SECRET="your-secret-key-here"
   ```

4. **Set up the database**

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## Available Routes

| Route                  | Description         | Auth Required     |
| ---------------------- | ------------------- | ----------------- |
| `/login`               | User login          | No                |
| `/register`            | User registration   | No                |
| `/`                    | Global article feed | No                |
| `/articles/:slug`      | Read single article | No                |
| `/articles/new`        | Create new article  | Yes               |
| `/articles/:slug/edit` | Edit article        | Yes (author only) |
| `/profile/:username`   | User profile        | No                |

## Authorization Rules

- **Public Access**: Anyone can view published articles and user profiles
- **Authenticated Users**: Can create articles (saved as drafts by default)
- **Article Authors**: Can edit, delete, and publish/unpublish their own articles only
- **Draft Protection**: Draft articles are only visible to their authors

## Features

### Authentication

- Email and password registration
- Secure login with bcrypt password hashing
- HTTP-only cookie-based sessions
- Protected routes via middleware

### Article Management

- Create articles in Markdown
- Auto-generated URL-friendly slugs
- Draft/publish workflow
- Edit and delete (author-only)
- Tag management

### Discovery

- Global feed of published articles
- Full-text search (title and body)
- Tag-based filtering
- Pagination support
- Sort by newest first

### User Profiles

- Public profile pages
- Display user's published articles
- Optional bio section

## Development

### Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name description

# Reset database (warning: destructive)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio
```

### Type Safety

The application uses TypeScript throughout with Prisma-generated types ensuring end-to-end type safety from database to UI.

## Security Features

- Passwords hashed with bcrypt
- HTTP-only cookies prevent XSS attacks
- JWT validation on protected routes
- Authorization checks on all mutations
- CSRF protection via same-origin policy

## Performance Considerations

- Server Components reduce client JavaScript
- Pagination prevents large data transfers
- Database indexes on frequently queried fields (slug, username)
- Efficient many-to-many tag relationships

## Intentional Scope

This project focuses on core blogging functionality. The following features are **intentionally excluded** to maintain focus:

- ❌ Comments
- ❌ Likes/reactions
- ❌ User following
- ❌ Draft collaboration
- ❌ Admin roles
- ❌ Rich text editor (Markdown is sufficient)

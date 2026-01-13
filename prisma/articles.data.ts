export const articlesData = [
  {
    title: "Getting Started with Next.js and Prisma",
    body: `
# Getting Started with Next.js & Prisma

This article is written in **Markdown**.

## Why Prisma?
Prisma gives you:
- Type safety
- Great DX
- Easy migrations

\`\`\`ts
const users = await prisma.user.findMany();
\`\`\`
    `,
    tags: ["nextjs", "prisma", "typescript"],
  },
  {
    title: "Designing a Scalable Dev Blog",
    body: `
# Designing a Scalable Dev Blog

A good blog architecture focuses on:
- Clean schema
- Fast queries
- Great DX

This post explains how to structure content properly.
    `,
    tags: ["postgres", "prisma"],
  },
  {
    title: "Markdown Tips for Developers",
    body: `
# Markdown Tips

Markdown is perfect for developer blogs.

## Tips
- Keep it simple
- Use headings properly
- Avoid over-nesting
    `,
    tags: ["markdown"],
  },
  {
    title: "Understanding Server Actions in Next.js",
    body: `
# Understanding Server Actions

Server Actions allow you to move logic to the server
without creating a separate API layer.

## Benefits
- Less boilerplate
- Better security
- Type-safe by default
    `,
    tags: ["nextjs", "server-actions"],
  },
  {
    title: "Database Seeding with Prisma",
    body: `
# Database Seeding with Prisma

Seeding helps you:
- Bootstrap development data
- Create demo content
- Test realistic scenarios

## Best Practices
- Make seeds idempotent
- Use transactions
- Avoid hardcoded IDs
    `,
    tags: ["prisma", "database"],
  },
  {
    title: "Building a Tag System for Articles",
    body: `
# Building a Tag System

Tags improve:
- Content discovery
- SEO
- User experience

## Schema Idea
Use a many-to-many relationship between articles and tags.
    `,
    tags: ["database", "schema", "prisma"],
  },
  {
    title: "Why Type Safety Matters in Fullstack Apps",
    body: `
# Why Type Safety Matters

Type safety reduces:
- Runtime errors
- Refactoring pain
- Unexpected bugs

Tools like TypeScript and Prisma make this easy.
    `,
    tags: ["typescript", "prisma"],
  },
  {
    title: "Handling Authentication in Next.js",
    body: `
# Handling Authentication

Authentication strategies:
- Credentials
- OAuth
- Magic links

Always hash passwords and protect server actions.
    `,
    tags: ["nextjs", "auth", "security"],
  },
  {
    title: "Writing Better Blog Content as a Developer",
    body: `
# Writing Better Developer Blogs

Good dev articles are:
- Practical
- Clear
- Example-driven

Avoid unnecessary theory and focus on real use cases.
    `,
    tags: ["writing", "career"],
  },
  {
    title: "Optimizing Database Queries with Prisma",
    body: `
# Optimizing Prisma Queries

Tips:
- Select only needed fields
- Use indexes
- Avoid N+1 queries

Performance matters even for small apps.
    `,
    tags: ["prisma", "performance", "postgres"],
  },
  {
    title: "Adding Reading Time to Your Blog",
    body: `
# Adding Reading Time

Reading time improves UX by setting expectations.

## How It Works
- Count words
- Divide by average reading speed
- Round up to minutes
    `,
    tags: ["ux", "blog"],
  },
  {
    title: "From Side Project to Production App",
    body: `
# From Side Project to Production

Things to consider:
- Environment variables
- Logging
- Error handling
- Backups

Small steps make projects sustainable.
    `,
    tags: ["career", "production"],
  },
];

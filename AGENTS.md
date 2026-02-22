# Repository Guidelines

## Project Structure & Module Organization

- `src/app`: Next.js App Router routes and layouts (RSC/Client components).
- `src/actions`: server actions for auth and content workflows.
- `src/components`: shared UI components and view fragments.
- `src/lib`: utilities (auth helpers, Prisma client, markdown utilities).
- `prisma`: schema and database configuration.
- `public`: static assets.

## Build, Test, and Development Commands

- `pnpm install`: install dependencies (preferred package manager; `pnpm-lock.yaml` is tracked).
- `pnpm dev`: run the Next.js dev server at `http://localhost:3000`.
- `pnpm build`: create the production build.
- `pnpm start`: run the production server from the build output.
- `pnpm lint`: run ESLint (Next.js + TypeScript rules).
- `pnpm dlx prisma migrate dev`: apply local database migrations.
- `pnpm dlx prisma studio`: open Prisma Studio.

## Coding Style & Naming Conventions

- Indentation: 2 spaces (see `.prettierrc`).
- TypeScript is required across `src/`; strict mode is enabled in `tsconfig.json`.
- Import alias: use `@/…` for `src` (e.g., `@/lib/prisma`).
- Filenames tend toward kebab-case for new files (see recent refactor history).
- Linting: `eslint` with Next.js core web vitals + TypeScript config.

## Testing Guidelines

- No automated test framework is configured yet.
- If you add tests, place them under `src/` alongside the feature or in a top-level `tests/` folder, and document the command in this file.

## Commit & Pull Request Guidelines

- Commit messages follow a Conventional Commits‑style prefix, typically `feat:`, `fix:`, or `refactor:` (variants like `refactor/feat:` appear in history).
- Keep the subject short and action-oriented (example: `fix: correct profile URL`).
- PRs should include:
  - A concise summary of the change.
  - Linked issue(s) when applicable.
  - Screenshots or GIFs for UI changes.

## Security & Configuration Tips

- Runtime secrets live in `.env` (database URL, JWT secret). Do not commit new secrets.
- Prisma access is centralized in `src/lib`, so reuse the existing client utilities instead of creating ad-hoc connections.

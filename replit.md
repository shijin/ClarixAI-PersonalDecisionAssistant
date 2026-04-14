# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Artifacts

### Clarix (`artifacts/clarix`) — React + Vite app at `/`

AI personal decision assistant. Helps users make confident decisions about finances, career, and life.

**Stack:**
- React + Vite (JSX — note: `.jsx` entry point, not `.tsx`)
- Tailwind CSS v4 (via `@tailwindcss/vite`) with custom design tokens in `src/index.css`
- `react-router-dom` v6 for routing
- `@supabase/supabase-js` for auth + database
- Font: Plus Jakarta Sans

**Required env vars:**
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon/public key
- `VITE_CLAUDE_API_KEY` — Claude API key (for AI features)

**Structure:**
- `src/App.jsx` — Root router with all routes defined
- `src/constants/routes.js` — All route path constants
- `src/constants/prompts.js` — AI system prompt + prompt builder
- `src/context/UserContext.jsx` — Supabase auth state context
- `src/lib/supabase.js` — Supabase client
- `src/lib/claude.js` — Claude client (stub)
- `src/hooks/` — `useAuth.js`, `useDecision.js` (stubs)
- `src/components/ui/` — Button, Card, Input, Tag, Toast, Spinner
- `src/components/layout/` — BottomNav, NavBar, StatusBar
- `src/components/decision/` — DecisionCard, RecommendationBlock, AssumptionStrip, TradeoffCard
- `src/screens/` — All placeholder screens organized by flow

## Shared Infrastructure

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

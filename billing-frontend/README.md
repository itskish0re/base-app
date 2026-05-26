# Billing frontend

React + [shadcn/ui](https://ui.shadcn.com) (Base UI primitives) + [Claude theme from tweakcn](https://tweakcn.com/editor/theme?theme=claude).

## Stack

| Package | Use |
|---------|-----|
| [TanStack Router](https://tanstack.com/router) | File-based routing, auth guards |
| [TanStack Query](https://tanstack.com/query) | Navigation / server state |
| [TanStack Form](https://tanstack.com/form) | Login form |
| [TanStack Table](https://tanstack.com/table) | Master grids (next) |
| [Redux Toolkit](https://redux-toolkit.js.org) | Auth tokens + session |
| [Lucide](https://lucide.dev) | Icons (shadcn default) |

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/installation) 10+ (`corepack enable` enables it from `packageManager` in `package.json`)
- Billing API on `http://localhost:5000` with CORS allowing `http://localhost:5173`

## Setup

```bash
cd billing-frontend
cp .env.example .env
pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173). Unauthenticated users are sent to `/login`.

## Auth flow

1. `POST /api/auth/login` → stores access + refresh tokens (Redux + `localStorage`).
2. API client attaches `Authorization: Bearer …` and on **401** calls `POST /api/auth/refresh` once, then retries.
3. Sign out calls `POST /api/auth/revoke` and clears local tokens.

## Sidebar

The app shell uses the [shadcn sidebar](https://ui.shadcn.com/docs/components/sidebar) block (`SidebarProvider`, collapsible icon mode, `NavMain` + `NavUser`). Menu data comes from `GET /api/access/navigation` with optional `badge`, `tooltip`, and `defaultExpanded` per row (apply EF migration `AddAppMenuSidebarColumns` on the API database).

## Add shadcn components

`components.json` uses **Base UI** style (`base-vega`). Install more components with:

```bash
pnpm dlx shadcn@latest add table dialog
```

Re-apply the Claude theme from [tweakcn](https://tweakcn.com/editor/theme?theme=claude) via **Code** export into `src/index.css` if you regenerate variables.

## Project layout

```
src/
  api/           # fetch client + refresh, auth, navigation
  components/ui/ # shadcn-style primitives (Base UI)
  components/app/# shell, sidebar
  features/auth/ # login page
  routes/        # TanStack Router file routes
  store/         # Redux auth slice
```

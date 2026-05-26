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

## Project layout (`src/`)

| Folder / file | Purpose | Put new code here when… |
|---------------|---------|-------------------------|
| **`main.tsx`** | App entry: TanStack Router + root mount. | Rarely touched. |
| **`routeTree.gen.ts`** | Generated routes (do not edit). | — |
| **`index.css`** | Global / theme CSS. | Theme tokens only. |
| **`app/`** | Global providers (`Providers.tsx`: Redux + React Query). | New global provider. |
| **`routes/`** | URLs, guards, redirects only — import pages from `pages/`. | New route or `beforeLoad` auth. |
| **`pages/`** | **One folder per screen** with `index.tsx` as the page entry. Add `table.tsx`, `form.tsx`, etc. for that screen only. | All screen UI for a menu/route. |
| **`components/ui/`** | shadcn primitives (Button, Input, Sidebar…). | `pnpm dlx shadcn add …` |
| **`components/derived/`** | **Reusable composed UI** (data table, entity form, page placeholder…). | Building blocks used across multiple pages. |
| **`components/app/`** | App shell: sidebar, header, nav links. | Layout chrome, not page content. |
| **`api/`** | HTTP client, queries, mutations. | Backend integration. |
| **`store/`** | Redux session state (auth). | Client state outside React Query. |
| **`hooks/`** | Shared hooks (`usePageMenuTitle`, …). | Used by 2+ pages. |
| **`lib/`** | Pure helpers (routes, JWT, utils). | Non-React utilities. |
| **`types/`** | Shared TS types (`AuthTokens`, …). | Cross-cutting types only. |

### Example: name boards screen

```
pages/masters/name-boards/
  index.tsx    # composes table + form; exports NameBoardsPage
  table.tsx    # grid for this screen (later)
  form.tsx     # create/edit form (later)

components/derived/
  data-table.tsx   # generic table wrapper (later)
  entity-form.tsx  # generic form wrapper (later)
```

Login already follows the pattern: `pages/login/index.tsx` + `pages/login/form.tsx`.

### How layers connect

```
routes/.../name-boards.tsx  →  pages/masters/name-boards/index.tsx
routes/_authenticated.tsx   →  components/app/AppShell
pages/.../table.tsx         →  components/derived/data-table (when added)
```

- **`routes/`** = wiring only.
- **`pages/<screen>/`** = screen-specific UI; colocate `table.tsx` / `form.tsx` here.
- **`components/derived/`** = shared complex widgets; not tied to one screen.
- **`components/ui/`** = low-level shadcn only; no billing domain.

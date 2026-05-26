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

### Environment variables

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | API base URL; leave empty in dev to use the Vite proxy |
| `VITE_ENABLE_QUERY_DEVTOOLS` | `true` to show [TanStack Query Devtools](https://tanstack.com/query/latest/docs/framework/react/devtools); use `false` for production |

`.env` lives in this folder next to `package.json`. Restart `pnpm dev` after changes.

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
| **`providers/`** | Global providers (`providers.tsx`: Redux + React Query). | New global provider. |
| **`routes/`** | URLs, guards, redirects only — import pages from `pages/`. | New route or `beforeLoad` auth. |
| **`pages/`** | **One folder per screen** with `index.tsx` as the page entry. Add `table.tsx`, `form.tsx`, etc. for that screen only. | All screen UI for a menu/route. |
| **`components/ui/`** | shadcn primitives (Button, Input, Sidebar…). | `pnpm dlx shadcn add …` |
| **`components/derived/`** | **Reusable composed UI** (data table, entity form, page placeholder…). | Building blocks used across multiple pages. |
| **`components/app/`** | App shell: sidebar, header, nav links. | Layout chrome, not page content. |
| **`config/endpoints.ts`** | API controller names + `endpoints.*` path builders. | New backend route. |
| **`constants/`** | Enums and shared constants (`queryKeys`, `MENU_GROUPS`, routes). | App-wide fixed values. |
| **`service/api/`** | Axios `client`, `tokens`, `functions/` (raw HTTP per entity). | Low-level API calls. |
| **`service/query/`** | TanStack `queryOptions` per entity + `index.ts`. | Server read/cache. |
| **`service/mutation/`** | TanStack `mutationOptions` per entity + `index.ts`. | Server writes. |
| **`store/`** | Redux: `auth` (always mounted) + **dynamic screen slices** (mounted per route). | Client state outside React Query. |
| **`store/screens/`** | One slice file per screen (`nameBoardsSlice.ts`, …). | Grid filter, selection, draft UI state for that screen. |
| **`hooks/useScreenSlice.ts`** | Injects/removes a screen reducer on mount/unmount. | Top of each page in `pages/…/index.tsx`. |
| **`hooks/`** | Shared hooks (`useMenuBootstrap`, `useScreenSlice`, …). | Used by 2+ pages / shell. |
| **`store/menuSlice.ts`** | Sidebar menus + `currentMenu` (hydrated from query). | UI state; fetch via `navigationQueryOptions`. |
| **`lib/`** | Pure helpers (JWT, utils, navigation tree). | Non-React utilities. |
| **`types/`** | Entity DTOs (`nameBoard.ts`, `truck.ts`, …), `common.ts`, barrel `index.ts`. | API request/response shapes. |

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

### API call flow

```
config/endpoints.ts          →  /api/name-boards/create
service/api/functions/       →  createNameBoards(body) uses api + endpoints
service/mutation/nameBoards  →  createNameBoardsMutationOptions for useMutation
service/query/nameBoards     →  listNameBoardsQueryOptions for useQuery
```

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

### File naming (outside `routes/`)

| Kind | Filename | Export name inside file |
|------|----------|-------------------------|
| Folders | `kebab-case` | — |
| React component modules (`.tsx`) | `kebab-case` | `PascalCase` (e.g. `app-shell.tsx` → `AppShell`) |
| Hooks, utils, store, API (`.ts`) | `camelCase` | `camelCase` / `PascalCase` as appropriate |
| `routes/` | unchanged (TanStack file routes) | — |

### Per-screen Redux (memory only while active)

`auth` stays in the store permanently. Each screen slice is **injected when the page mounts** and **removed on unmount** (state is discarded).

```tsx
// pages/masters/name-boards/index.tsx
import { useScreenSlice, useScreenSelector } from '@/hooks/useScreenSlice';
import { SCREEN_KEYS } from '@/store/screenKeys';
import { nameBoardsScreenActions } from '@/store/screens/nameBoardsSlice';

export function NameBoardsPage() {
  useScreenSlice(SCREEN_KEYS.nameBoards);

  const filter = useScreenSelector(SCREEN_KEYS.nameBoards, (s) => s.filter);
  const dispatch = useAppDispatch();
  // dispatch(nameBoardsScreenActions.setFilter('acme'));
}
```

Add a new screen: create `store/screens/<name>Slice.ts`, register in `store/screens/registry.ts` and `store/screenKeys.ts`, call `useScreenSlice` in the page `index.tsx`.

Use **TanStack Query** for server/list data; use **screen slices** for UI-only state (filters, selection, panel open, draft form).

Navigation menus: `service/query/access.ts` → `navigationQueryOptions()` → `useMenuBootstrap` dispatches into `menuSlice`.

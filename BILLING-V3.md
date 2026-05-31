# Billing v3 — project blueprint

**Single source of truth** for product goals, architecture, and schema.  
**Hands-on implementation reference (DataTable, screen metadata, seeds):** [`docs/BILLING-V3-IMPLEMENTATION-CONTEXT.md`](./docs/BILLING-V3-IMPLEMENTATION-CONTEXT.md)  
**Canonical database diagram:** [`dbdiagram.dbml`](./dbdiagram.dbml)

**Last updated:** 2026-05-26

---

## 1. Purpose

Billing v3 is a **single-organization billing / CRM foundation** with:

- PostgreSQL as the database
- **.NET 10** Web API with **Clean Architecture** (Api → Application → Domain → Infrastructure)
- **CQRS** (MediatR), **FluentValidation**, **Gridify** for list/filter/sort
- **EF Core** for masters and platform/registry tables
- **Dapper** for auth and refresh tokens
- **No PostgreSQL CRUD functions** — all logic in C#
- **React** frontend (`billing-frontend/`) with screen-driven grids and forms

Earlier work lived in `billing_v2/` (SQL + functions) and `old/` (first .NET API). **v3 is the active codebase** under `billing/` and `billing-frontend/`.

---

## 2. Repository layout

```
base-app/
├── BILLING-V3.md                              ← this file (blueprint)
├── docs/BILLING-V3-IMPLEMENTATION-CONTEXT.md  ← built features, DataTable, naming (new chats)
├── dbdiagram.dbml                             ← schema source of truth
├── billing/                                   ← .NET API (Billing.sln)
│   ├── src/{SharedKernel,Domain,Application,Infrastructure,Web.Api}
│   ├── scripts/                               ← PostgreSQL seeds (per-table folders)
│   └── README.md
└── billing-frontend/                          ← React + Vite + shadcn + TanStack
    └── README.md
```

---

## 3. Tech stack

| Concern | Choice |
|---------|--------|
| Runtime | .NET 10 |
| API | ASP.NET Core Web API, Swagger |
| CQRS | MediatR |
| Validation | FluentValidation + pipeline behavior |
| Lists | Gridify.EntityFramework on `IQueryable` |
| ORM | EF Core 10 + Npgsql (snake_case naming) |
| Auth | JWT + refresh rotation (Dapper) |
| DB | PostgreSQL (Neon) |
| Migrations | EF Core (`Persistence/Migrations/`); auto-apply in **Development** |
| Frontend | React 19, Vite, TanStack Router/Query/Table/Form, Redux Toolkit, Zustand (per DataTable), shadcn/ui |

---

## 4. Architecture (layers)

| Layer | Responsibility |
|-------|----------------|
| **Web.Api** | Controllers, JWT, `EndpointAccessMiddleware`, Swagger |
| **Application** | Commands/queries, validators, DTOs, `FieldNameConverter`, Gridify helpers |
| **Domain** | Entities, repository interfaces (masters, registry, auth) |
| **Infrastructure** | EF `BillingDbContext`, Dapper repos, Gridify mappers, migrations |

### Persistence split

| Data | Persistence |
|------|-------------|
| Auth (`app_user`, `refresh_token`) | Dapper |
| Menus / role-menu (admin) | EF |
| Registry + UI metadata (`app_entity*`, `app_entity_screen*`) | EF |
| Masters (`name_board`, `truck`, …) | EF + domain repos |

### CQRS flow

- **Command:** API → MediatR → validation → handler → repository / `SaveChanges`
- **List query:** API → MediatR → Gridify on `IQueryable` → camelCase DTOs (Mapster)
- **Screen config:** `GET /api/screens/by-menu/{menuCode}` → metadata with **camelCase** `fieldName` for the UI

---

## 5. Database schema

Open **`dbdiagram.dbml`** for tables, indexes, and groups.

### Table groups

| Group | Tables | Purpose |
|-------|--------|---------|
| **auth** | `app_role`, `app_user`, `refresh_token` | Login, JWT |
| **access_control** | `app_menu`, `app_role_menu`, `app_endpoint`, `app_role_endpoint` | Sidebar + API auth |
| **app_entity_registry** | `app_entity`, `app_entity_field`, `app_field_data_type` | API/Gridify contract |
| **app_entity_ui** | `app_entity_screen`, `app_entity_screen_column`, `app_entity_screen_field` | Per-menu grid + form |

### Standard columns on business tables

`created_at`, `updated_at`, `created_by`, `updated_by`,  
`is_enabled`, `is_active`, `is_deleted`, `deleted_at`

**UI rule:** `is_enabled` / `is_active` are **not grid columns** (`is_visible = false` on screen columns). They drive row actions (`isEnabled`) and inactive row styling (`isActive === false`).

### Registry field names

- **Database:** `app_entity_field.field_name` = **snake_case** (`owner_name`)
- **Screen metadata API + list DTOs:** **camelCase** (`ownerName`) — converted in `AppEntityScreenRepository` via `FieldNameConverter`

---

## 6. What is implemented (2026-05-26)

### API (`billing/`)

- Clean Architecture solution + tests
- Auth, navigation, menu admin, endpoint access middleware
- EF migrations through platform + masters (name board, truck)
- **Masters:** Name boards, trucks — CRUD/list/batch/toggle/lookup
- **Screen metadata:** `GET /api/screens/by-menu/{menuCode}`
- Gridify list filters; global search normalized (`GridifyListFilter`)
- `column_width_percent` on screen columns (replaced `column_width` / `min_width`)
- Seed scripts under `billing/scripts/` — see `scripts/README.md`

### Frontend (`billing-frontend/`)

- Auth, sidebar from `GET /api/access/navigation`, protected routes
- **Per-screen Redux slices** (dynamic inject) + `useScreenSlice` / `useScreenMetadata`
- **Shared `DataTable`** module — metadata-driven columns, width layout, actions column, column cells, skeleton loading
- **Name Boards** and **Trucks** master pages wired end-to-end

Details: **[`docs/BILLING-V3-IMPLEMENTATION-CONTEXT.md`](./docs/BILLING-V3-IMPLEMENTATION-CONTEXT.md)**

---

## 7. DataTable & screen metadata (summary)

Full detail in the implementation context doc. Short version:

| Topic | Decision |
|-------|----------|
| Table state | Redux screen slice (`table`: page, sort, global filter, selection) |
| Column visibility / filters | Zustand inside `DataTableProvider` |
| Column widths | `column_width_percent`; fill remaining space equally when sum &lt; budget |
| Actions | Metadata `column_component = 'actions'` + page `renderActionsColumn` |
| Cells | `column_component` → `column-cells/*` (badge, mobile, vehicle_number, boolean, date, currency, text) |
| Loading | Render full column headers from metadata; skeleton rows for data fetch |

---

## 8. Build & run

### API

```bash
cd billing
dotnet build Billing.sln
dotnet run --project src/Web.Api/Web.Api.csproj
```

Development: Swagger at `/swagger`; migrations apply on startup.

### Frontend

```bash
cd billing-frontend
cp .env.example .env
pnpm install
pnpm dev
```

API proxy / `VITE_API_BASE_URL` — see `billing-frontend/README.md`.

### Seeds (after migrate)

```bash
# From billing/ — see scripts/README.md for full order
psql "$CONN" -f scripts/app_menu/seed_billing_menus.sql
psql "$CONN" -f scripts/app_entity/insert.sql
# … entity fields, screens, columns, endpoints, role_endpoint
```

---

## 9. Backlog (near term)

- Wire remaining master pages to `DataTable` (copy Name Boards pattern)
- Form UI from `app_entity_screen_field` metadata
- Server-side per-column filters (optional; today client-side on loaded rows)
- Additional masters / transactions per product roadmap
- Architecture test coverage as solution grows

---

## 10. Key design decisions (log)

| Date | Decision |
|------|----------|
| 2026-05 | v3: .NET owns CRUD; no PG `fn_*` routines |
| 2026-05 | CQRS + FluentValidation + Gridify |
| 2026-05 | Split grid columns vs form fields (`app_entity_screen_column` / `_field`) |
| 2026-05 | EF migrations (not FluentMigrator) |
| 2026-05-26 | `column_width_percent` on screen columns; actions column in metadata |
| 2026-05-26 | `is_enabled` / `is_active` hidden from grid; state-only on DTOs |
| 2026-05-26 | camelCase `fieldName` in screen metadata API; snake_case in DB |
| 2026-05-26 | Hybrid Redux (table) + Zustand (DataTable UI) on frontend |
| 2026-05-26 | `column_component` registry for grid cell renderers |

---

## 11. Documentation map

| Document | Use when |
|----------|----------|
| **BILLING-V3.md** (this file) | Goals, stack, schema groups, decisions |
| **[docs/BILLING-V3-IMPLEMENTATION-CONTEXT.md](./docs/BILLING-V3-IMPLEMENTATION-CONTEXT.md)** | Continuing UI/API work, DataTable, seeds, file paths |
| **dbdiagram.dbml** | Table/column definitions |
| **billing/README.md** | API run, EF, endpoints |
| **billing/scripts/README.md** | Seed order and SQL folders |
| **billing-frontend/README.md** | Frontend layout and conventions |

---

*For schema details, always consult [`dbdiagram.dbml`](./dbdiagram.dbml). For day-to-day coding on grids and metadata, start with [`docs/BILLING-V3-IMPLEMENTATION-CONTEXT.md`](./docs/BILLING-V3-IMPLEMENTATION-CONTEXT.md).*

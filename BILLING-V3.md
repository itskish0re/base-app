# Billing v3 — project blueprint

**Single source of truth** for what we planned, decided, and built for billing v3.  
**Canonical database diagram:** [`dbdiagram.dbml`](./dbdiagram.dbml) (import into [dbdiagram.io](https://dbdiagram.io)).

**Last updated:** 2026-05-20

---

## 1. Purpose

Billing v3 is a **single-organization billing / CRM foundation** with:

- PostgreSQL as the database
- **.NET 10** Web API with **Clean Architecture** (Api → Application → Domain → Infrastructure)
- **CQRS** (MediatR), **FluentValidation**, **Gridify** for list/filter/sort
- **EF Core** for masters and platform/registry tables
- **Dapper** (optional) for high-volume transaction I/O
- **No PostgreSQL CRUD functions** (`fn_read`, `fn_upsert`, etc.) — all logic in C#

Earlier work lived in `billing_v2/` (SQL + functions only) and `old/` (first .NET API calling PG routines). **v3 replaces that application approach** while reusing the same product ideas (auth, menus, entity registry, UI metadata).

---

## 2. Evolution

| Version | Location | Approach |
|---------|----------|----------|
| **v2** | `billing_v2/` | DDL + `functions.sql` + generic JSONB CRUD in PostgreSQL |
| **v1 API** | `old/` | .NET called PG `fn_*`; Dapper for auth/menus |
| **v3** | Repo root (`dbdiagram.dbml`) | .NET owns CRUD; EF + CQRS; solution TBD from Clean Architecture template |

---

## 3. Goals

- Auth (JWT + refresh rotation), role-based **endpoint** and **menu** access
- **Entity registry** (`app_entity`, `app_entity_field`, …) for API field whitelists and Gridify
- **UI screen metadata** (`app_entity_screen*`) for React grid/form per menu
- **Master** tables (EF Core, rich domain when added) with standard audit + soft delete
- **Transaction** tables (optional Dapper) added per feature
- React frontend later; API exposes navigation + screen config

## 4. Non-goals (v3 initial scope)

- Multi-tenant / org isolation
- `app_entity_rule` in DB (validation → **FluentValidation** in Application)
- Generic PG CRUD routines
- FluentMigrator (see §10) — **EF Core migrations** chosen instead
- Full business masters (product, customer, …) — schema template only until defined

---

## 5. Tech stack

| Concern | Choice |
|---------|--------|
| Runtime | .NET 10 |
| API | ASP.NET Core Web API, Swagger |
| CQRS | MediatR 14 |
| Validation | FluentValidation 12 + `ValidationBehavior` pipeline |
| Queries (lists) | Gridify.EntityFramework 2.19.x on `IQueryable` / read DTOs |
| ORM (masters + platform) | EF Core 10 + Npgsql |
| Hot-path SQL (optional) | Dapper 2.x |
| Auth | JWT Bearer + refresh tokens (SHA-256 in DB) |
| DB | PostgreSQL (Neon) |
| Schema docs | DBML → `dbdiagram.dbml` |
| Migrations | **EF Core migrations** (you will drop tables and apply fresh) |

---

## 6. Architecture

**Repository (current):** only documentation at repo root:

```
base-app/
├── BILLING-V3.md      ← this file
└── dbdiagram.dbml     ← canonical schema (DBML)
```

**Solution (next):** scaffold from Clean Architecture template + reference project:

```
<solution>/
├── Billing.slnx
└── src/
    ├── Billing.Api/
    ├── Billing.Application/
    ├── Billing.Domain/
    └── Billing.Infrastructure/
```

### Layer responsibilities

| Layer | Responsibility |
|-------|----------------|
| **Api** | Controllers, `EndpointAccessMiddleware`, JWT, Swagger |
| **Application** | Commands/queries, validators, orchestration |
| **Domain** | Repository interfaces, thin models for auth/config; **future:** `AuditableEntity`, business aggregates |
| **Infrastructure** | EF mappings, Dapper, external services |

### Persistence split (planned steady state)

| Data | Persistence | Domain style |
|------|-------------|--------------|
| `app_user`, `refresh_token`, menus, endpoints | **Dapper** (today) | Records + repos (like today) |
| `app_entity*` registry + UI metadata | **EF Core** | Domain types in `Domain.Registry`; EF maps same types from Infrastructure |
| Business **masters** | **EF Core** | Rich domain entities (planned, clean-todo style) |
| Business **transactions** | **EF or Dapper** per `persist_mode` on `app_entity` | Rich domain + repo |

### CQRS flow

- **Command:** API → MediatR → FluentValidation → handler → repository / `DbContext` → save
- **Query (list):** API → MediatR → Gridify on allowed fields from `app_entity_field` → projected DTO
- **Query (single):** MediatR → EF or Dapper → DTO

---

## 7. Database schema (`dbdiagram.dbml`)

Open **`dbdiagram.dbml`** for the full diagram, enums, indexes, and table groups.

### Table groups

| Group | Tables | Purpose |
|-------|--------|---------|
| **auth** | `app_role`, `app_user`, `refresh_token` | Login, JWT, refresh rotation |
| **access_control** | `app_menu`, `app_role_menu`, `app_endpoint`, `app_role_endpoint` | Sidebar + API authorization |
| **app_entity_registry** | `app_entity`, `app_entity_field`, `app_entity_dependency` | API/Gridify contract, delete guards |
| **app_entity_ui** | `app_entity_screen`, `app_entity_screen_column`, `app_entity_screen_field` | Per-menu grid + form layout |

### v3 vs v2 schema (important if migrating data)

| v2 | v3 |
|----|-----|
| `app_entity.read_source`, `pk_column`, `id_sql_type` | Removed — EF/Dapper map in code |
| `app_entity_rule` | **Removed** — FluentValidation |
| `app_entity_field.upsertable` | Renamed to **`writable`** |
| — | `app_entity.persist_mode` (`ef_core` \| `dapper`) |
| Screen column/field by `(entity_id, field_name)` | **`entity_field_id`** FK |

### Standard columns on future business tables

Every master / transaction table should include:

`created_at`, `updated_at`, `created_by`, `updated_by`,  
`is_enabled`, `is_active`, `is_deleted`, `deleted_at`

(Register each table in `app_entity` + fields + screen config when the React UI is wired.)

---

## 8. What is done

### Repository (this repo)

- **`BILLING-V3.md`** and **`dbdiagram.dbml`** at repo root
- Prior code (`billing_v3/src`, `old/`, `billing_v2/`, etc.) removed — rebuild from template next

### Previously implemented (prototype, removed from repo)

A working prototype existed under `billing_v3/src` (auth, menus, EF `DbContext`, CQRS). Use this blueprint when re-implementing on the template.

### Implemented API surface

| Area | Endpoints | Notes |
|------|-----------|--------|
| Health | `GET /api/health` | Smoke test |
| Auth | `POST /api/auth/login`, `refresh`, `revoke` | BCrypt, JWT, refresh rotation |
| Access | `GET /api/access/navigation` | Menus for logged-in user |
| Menus (admin) | `GET /api/menus/admin/matrix`, `PUT .../roles/{id}/menus/{id}` | |
| Anon | `GET /api/anon/landing` | Public endpoint demo |
| Endpoint security | `[EndpointAccess("code")]` + middleware | DB-driven, cached |

### Application

- MediatR registration
- `ValidationBehavior` + `LoginCommandValidator`
- Auth / access / menu handlers (ported from `old/`)

### Infrastructure

- `BillingDbContext` + EF configurations for all `app_*` platform tables
- `BillingDbContextFactory` for `dotnet ef`
- Dapper: `UserRepository`, `RefreshTokenRepository`, `MenuRepository`, `EndpointAccessRepository`
- JWT, BCrypt, refresh token crypto
- Snake case naming (`EFCore.NamingConventions`)

### Configuration

- Connection string + JWT copied from **`old/src/Billing.Api/appsettings.json`** (Neon `billing` database)
- User secrets id: `billing-v3-api-dev-secrets`

### Not generated yet

- EF migration files under `Persistence/Migrations/` (you will create after dropping tables)
- Seed data script in v3 (adapt from `billing_v2/Insert.sql`)
- Business master tables / handlers / Gridify list endpoints
- Domain `BaseEntity` / `AuditableEntity` (decided pattern, not scaffolded)
- React client

---

## 9. What is planned (backlog)

### Immediate (you)

1. **Drop** existing tables on Neon `billing` database.
2. **Create & apply** EF initial migration (see §10).
3. **Seed** roles, admin user, menus, endpoints (from v2 insert script or manual).

### Short term (next dev phase)

- Scaffold **domain abstractions** (clean-todo style) for first master only:
  - `AuditableEntity`, `IUnitOfWork`, optional `IDomainEvent`
  - First master aggregate + repository + Create/Update/Delete/List commands
- Gridify query handler pattern using `app_entity_field` whitelist
- Screen config query: `fn_entity_screen_config` equivalent in C#
- Port/adapt seeds to v3

### Medium term

- .NET API stable for React app
- Transaction entities with `persist_mode = dapper` where needed
- Architecture tests (layer dependency rules), like clean-todo test project

### Next major step (your message)

You will provide **two repositories**:

1. **Clean Architecture template** — empty / starter structure  
2. **Complete project** — full implementation using that template  

We will **create a new solution from the template** aligned with this blueprint (stack, DBML, auth, registry, CQRS conventions)—not continue incrementally on the current `billing_v3/src` prototype if the template is the preferred base.

**What we will need from those projects when you share them:**

| Item | Use |
|------|-----|
| Template folder structure & naming | Target layout for v3 |
| How Domain abstractions are defined | `BaseEntity`, events, UoW |
| How Infrastructure registers EF/Dapper | DI patterns |
| How Application wires MediatR + validation | Pipeline |
| Reference app’s Todo (or similar) vertical slice | Copy patterns for masters |
| Test / architecture projects (if any) | Optional guardrails |

---

## 10. Database migrations

**Your plan:** delete existing tables → apply schema from migrations.

**Recommended tool:** EF Core migrations (already wired). **FluentMigrator was considered and not adopted** to avoid two schema owners.

### Prerequisites

```bash
dotnet tool install --global dotnet-ef
```

### Steps (fresh database)

```bash
# Run from solution root after template scaffold (paths may vary)

dotnet ef migrations add InitialPlatformSchema \
  --project Billing.Infrastructure/Billing.Infrastructure.csproj \
  --startup-project Billing.Api/Billing.Api.csproj \
  --output-dir Persistence/Migrations

# Review generated migration SQL, then:
dotnet ef database update \
  --project Billing.Infrastructure/Billing.Infrastructure.csproj \
  --startup-project Billing.Api/Billing.Api.csproj
```

`BillingDbContextFactory` reads `Billing.Api/appsettings.json` → `ConnectionStrings:DefaultConnection`.

### After migrate

- Run seed SQL for roles, user, menus, endpoints.
- Start API: `dotnet run --project src/Billing.Api/Billing.Api.csproj` (or per template layout)
- Call `POST /api/auth/login` with seeded user.

---

## 11. Domain design (decided, not all coded)

Inspired by **clean-todo-api** Clean Architecture sample (external reference when provided):

| Pattern | Use for billing v3? |
|---------|---------------------|
| `BaseEntity` + domain events | **Yes** — business masters/transactions only |
| Rich entity methods + private setters | **Yes** — masters/transactions |
| Repository interface in Domain | **Yes** — already used for auth |
| `IUnitOfWork` | **Yes** — when one command uses multiple repos or EF + Dapper |
| Same pattern for `app_user` | **No** — keep records + Dapper |
| Rich aggregates for `app_entity*` registry | **No** — registry types live in `Domain.Registry`, mapped by EF (no separate Infrastructure DTOs) |

Avoid **duplicate** models: either EF maps the domain entity, or map explicitly at the repository—do not maintain both `PlatformEntities` and rich domain for the same table without a rule.

---

## 12. Key design decisions (log)

| Date | Decision |
|------|----------|
| 2026-05 | v3 folder; DBML first; no PG CRUD functions |
| 2026-05 | CQRS + FluentValidation + Gridify (not PG `fn_read`) |
| 2026-05 | Split UI: `app_entity_screen_column` vs `app_entity_screen_field` |
| 2026-05 | Do **not** merge `app_entity_field` with `app_entity_screen` (different cardinality) |
| 2026-05 | Remove `app_entity_rule`; validate in FluentValidation |
| 2026-05 | Repo trimmed to blueprint + DBML only; code removed pending template |
| 2026-05 | EF Core for platform schema; Dapper for auth (for now) |
| 2026-05 | FluentMigrator **not** used; EF migrations for DDL |
| 2026-05 | Neon connection string reused from old API |
| Next | Rebase on external Clean Architecture template + reference app |

---

## 13. Build & run

No solution in this repo yet. After scaffolding from the Clean Architecture template:

```bash
dotnet build Billing.slnx
dotnet run --project src/Billing.Api/Billing.Api.csproj
```

---

## 14. Files in this repository

| Path | Role |
|------|------|
| `BILLING-V3.md` | Project blueprint (this file) |
| `dbdiagram.dbml` | **Schema source of truth** |

---

## 15. Checklist for template-based rebuild

When the two new projects are provided, verify the generated solution includes:

- [ ] Projects: Api, Application, Domain, Infrastructure (+ Tests optional)
- [ ] MediatR + FluentValidation pipeline
- [ ] EF Core + Npgsql + snake case naming
- [ ] Gridify for queries
- [ ] Dapper + connection factory for auth (or EF for auth if template prefers single ORM)
- [ ] JWT + refresh token flow matching `dbdiagram.dbml`
- [ ] Endpoint access middleware + `[EndpointAccess]`
- [ ] `BillingDbContext` (or equivalent) matching **`dbdiagram.dbml`**
- [ ] EF migration for full platform schema
- [ ] Seed script for roles, user, menus, endpoints
- [ ] Domain `AuditableEntity` for first business master
- [ ] No PostgreSQL stored procedures for CRUD

---

*End of blueprint. For schema details, always consult [`dbdiagram.dbml`](./dbdiagram.dbml).*

# Billing v3 API

.NET 10 Clean Architecture solution using the **same layout as `sample/clean_architecture`**, aligned with [`BILLING-V3.md`](../BILLING-V3.md) and [`dbdiagram.dbml`](../dbdiagram.dbml).

**Authentication:** custom JWT + refresh tokens (BCrypt, Dapper). **No Keycloak.**

## Solution structure (matches clean_architecture template)

```
billing/
├── Billing.sln
├── Solution Items/          (.editorconfig, Directory.Build.props)
├── docker-compose.yml       (optional local dependencies)
├── src/
│   ├── SharedKernel/        # Entity, Result, Error, IDomainEvent, Ensure
│   ├── Domain/              # Auth, access, Registry (app_entity*), AuditableEntity base
│   ├── Application/         # CQRS handlers, validators
│   ├── Infrastructure/      # EF configurations + Dapper (auth), JWT
│   └── Web.Api/             # Controllers, middleware, Swagger
└── tests/
    ├── ArchitectureTests/
    ├── Domain.UnitTests/
    ├── Application.UnitTests/
    ├── Application.IntegrationTests/
    └── Api.FunctionalTests/
```

## Run

```bash
dotnet build Billing.sln
dotnet run --project src/Web.Api/Web.Api.csproj
```

In Development, open Swagger at `/swagger`, call `POST /api/auth/login`, then click **Authorize** and paste the `accessToken` value (without the `Bearer` prefix).

## Master table naming

| Rule | Example |
|------|---------|
| Primary key | `{table}_id` → `truck_id`, `driver_id` |
| Foreign key | `{referenced_table}_id` → `name_board_id`, `truck_id` |
| Domain navigations | `Truck.NameBoard`, `Driver.Truck`, `NameBoard.Trucks` |
| EF mapping | `Infrastructure/Persistence/Configurations/*Configuration.cs` |
| DTO mapping | [Mapster](https://github.com/MapsterMapper/Mapster) (`Application/Mappings/`) |

## Database (Neon)

In **Development**, pending EF migrations are applied once at startup (`ApplyMigrations` in `Program.cs`). Already-applied migrations are skipped (tracked in `__EFMigrationsHistory`).

Local API runs against your **Neon** PostgreSQL connection in `src/Web.Api/appsettings.json` (`ConnectionStrings:DefaultConnection`). Do **not** add a `ConnectionStrings` block to `appsettings.Development.json` with `localhost` or `127.0.0.1` — that would override Neon in Development.

`docker-compose.yml` includes an optional local Postgres service for the clean-architecture template; the Web API is **not** wired to it. You do not need `docker compose up postgres` for normal development.

To keep credentials out of git, move the connection string to [user secrets](https://learn.microsoft.com/aspnet/core/security/app-secrets) (`UserSecretsId`: `billing-v3-api-dev-secrets`):

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "<your-neon-connection-string>" \
  --project src/Web.Api/Web.Api.csproj
```

Then remove the password from `appsettings.json` or replace it with an empty placeholder.

```bash
dotnet ef migrations add InitialPlatformSchema \
  --project src/Infrastructure/Infrastructure.csproj \
  --startup-project src/Web.Api/Web.Api.csproj \
  --output-dir Persistence/Migrations

dotnet ef database update \
  --project src/Infrastructure/Infrastructure.csproj \
  --startup-project src/Web.Api/Web.Api.csproj
```

### Name board API

Only **GET** and **POST** are used. Create, update, and delete accept a **list** (one item works the same as many).

After auth seed data exists, register endpoint permissions:

```bash
# New database
psql "<connection-string>" -f scripts/seed-name-board-endpoints.sql

# Already ran the old seed (PUT/DELETE routes)
psql "<connection-string>" -f scripts/update-name-board-endpoints.sql
```

Restart the API (or wait for endpoint cache expiry) after changing `app_endpoint` rows.

| Method | Route | Endpoint code |
|--------|-------|----------------|
| GET | `/api/name-boards` | `name-boards.list` |
| GET | `/api/name-boards/{id}` | `name-boards.get` |
| POST | `/api/name-boards/create` | `name-boards.create` |
| POST | `/api/name-boards/update` | `name-boards.update` |
| POST | `/api/name-boards/delete` | `name-boards.delete` |
| POST | `/api/name-boards/toggle` | `name-boards.toggle` |

List supports Gridify: `filter`, `orderBy`, `page`, `pageSize`.

**Create** body example (single or multiple via `items`):

```json
{
  "items": [
    { "name": "Board A", "code": "A-01", "ownerName": "Jane", "ownerPhone": "+15551234567" }
  ]
}
```

**Update** body: `items` with `nameBoardId` plus fields. **Delete** body: `{ "ids": [1, 2] }`.

**Toggle** body (`isEnabled` maps to `is_enabled` column):

```json
{
  "items": [
    { "nameBoardId": 1, "isEnabled": true },
    { "nameBoardId": 2, "isEnabled": false }
  ]
}
```

To add only this endpoint to an existing database:

```bash
psql "<connection-string>" -f scripts/add-name-board-toggle-endpoint.sql
```

Batch responses include `created` / `updated` / `deletedIds` and per-index `failures` for partial success.

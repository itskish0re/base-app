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

`app_menu`, `app_role`, and `app_role_menu` are accessed via EF Core (`MenuRepository`). Apply migrations:

```bash
dotnet ef database update \
  --project src/Infrastructure/Infrastructure.csproj \
  --startup-project src/Web.Api/Web.Api.csproj
```

Latest menu migrations: `MapAppRoleAndRoleMenu` (`menu_group`), `DropAppMenuGroupLabel` (drops `group_label` column).

After migrations, seed platform and registry data (see [`scripts/README.md`](scripts/README.md)):

```bash
CONN="<connection-string>"
psql "$CONN" -f scripts/app_entity/insert.sql
psql "$CONN" -f scripts/app_entity_field/name_board.sql
psql "$CONN" -f scripts/app_entity_field/truck.sql
psql "$CONN" -f scripts/app_entity_field/driver.sql
psql "$CONN" -f scripts/app_endpoint/auth_access.sql
psql "$CONN" -f scripts/app_endpoint/name_boards.sql
psql "$CONN" -f scripts/app_endpoint/trucks_drivers.sql
psql "$CONN" -f scripts/app_endpoint/menus.sql
psql "$CONN" -f scripts/app_role_endpoint/auth_access.sql
psql "$CONN" -f scripts/app_role_endpoint/name_boards_admin.sql
psql "$CONN" -f scripts/app_role_endpoint/trucks_drivers_admin.sql
psql "$CONN" -f scripts/app_role_endpoint/menus_admin.sql
```

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

Register endpoint permissions: `scripts/app_endpoint/name_boards.sql` and `scripts/app_role_endpoint/name_boards_admin.sql` (see `scripts/README.md`).

Restart the API (or wait for endpoint cache expiry) after changing `app_endpoint` rows.

| Method | Route | Endpoint code |
|--------|-------|----------------|
| GET | `/api/name-boards` | `name-boards.list` |
| GET | `/api/name-boards/{id}` | `name-boards.get` |
| POST | `/api/name-boards/create` | `name-boards.create` |
| POST | `/api/name-boards/update` | `name-boards.update` |
| POST | `/api/name-boards/delete` | `name-boards.delete` |
| POST | `/api/name-boards/toggle` | `name-boards.toggle` |
| POST | `/api/name-boards/lookup` | `name-boards.lookup` |

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

Batch responses include `created` / `updated` / `deletedIds` and per-index `failures` for partial success.

### Menu API

Admin CRUD for `app_menu` (sidebar entries). Same GET + POST batch pattern as masters.

| Method | Route | Endpoint code |
|--------|-------|----------------|
| GET | `/api/menus` | `menus.list` |
| GET | `/api/menus/{id}` | `menus.get` |
| POST | `/api/menus/create` | `menus.create` |
| POST | `/api/menus/update` | `menus.update` |
| POST | `/api/menus/delete` | `menus.delete` |
| POST | `/api/menus/toggle` | `menus.toggle` |

List query: `filter`, `isActive`, `page`, `pageSize`. Delete sets `is_active = false` (blocked if active child menus exist).

Seed: `scripts/app_endpoint/menus.sql` and `scripts/app_role_endpoint/menus_admin.sql`.

### Application layer layout (masters)

Each master entity has a folder under `Application/Masters/{EntityName}/`:

| File | Contents |
|------|----------|
| `Dtos.cs` | Request/response records for API and handlers |
| `Create.cs` | Batch create command, handler, and validator |
| `List.cs` | List query, handler, and validator |
| `GetById.cs` | Get-by-id query and handler |
| `Update.cs` | Batch update command, handler, and validator |
| `Delete.cs` | Batch delete command, handler, and validator |
| `Toggle.cs` | Batch toggle command, handler, and validator |
| `Lookup.cs` | Entity-specific dropdown lookup query and handler |
| `Errors.cs` | Shared domain errors |
| `Mappings.cs` | Domain → DTO mapping helpers |

### Name board lookup (dropdowns)

`POST /api/name-boards/lookup` (`name-boards.lookup`) — returns enabled, active name boards. The client sends the desired output **schema**: required `value` and `label` column names (snake_case, must exist on `name_board`), plus optional `fields` array of `{ keyName, columnName }`. Column names are validated before the query runs.

Request:

```json
{
  "value": "name_board_id",
  "label": "name",
  "fields": [
    { "keyName": "code", "columnName": "code" },
    { "keyName": "ownerName", "columnName": "owner_name" }
  ]
}
```

Response:

```json
{
  "items": [
    {
      "value": 1,
      "label": "Main Board",
      "fields": {
        "code": "MAIN",
        "ownerName": "Jane Doe"
      }
    }
  ]
}
```

Allowed columns are derived from the domain entity’s scalar properties (snake_case) — see `Application/Common/Lookup/EntityColumnResolver.cs`. Navigation properties (e.g. collections) are excluded.

**Transaction entities** (future): use `IRegistryColumnResolver`, which reads selectable columns from `app_entity_field` where `entity_kind = transaction`. Name board lookup does **not** use the registry resolver.

### Truck API

| Method | Route | Endpoint code |
|--------|-------|----------------|
| GET | `/api/trucks` | `trucks.list` |
| GET | `/api/trucks/{id}` | `trucks.get` |
| POST | `/api/trucks/lookup` | `trucks.lookup` |
| POST | `/api/trucks/create` | `trucks.create` |
| POST | `/api/trucks/update` | `trucks.update` |
| POST | `/api/trucks/delete` | `trucks.delete` |
| POST | `/api/trucks/toggle` | `trucks.toggle` |

**Create** body example: `{ "items": [{ "truckNumber": "TN-01", "nameBoardId": 1 }] }`

Delete is blocked when the truck has active drivers (`Truck.HasDrivers`).

### Driver API

| Method | Route | Endpoint code |
|--------|-------|----------------|
| GET | `/api/drivers` | `drivers.list` |
| GET | `/api/drivers/{id}` | `drivers.get` |
| POST | `/api/drivers/lookup` | `drivers.lookup` |
| POST | `/api/drivers/create` | `drivers.create` |
| POST | `/api/drivers/update` | `drivers.update` |
| POST | `/api/drivers/delete` | `drivers.delete` |
| POST | `/api/drivers/toggle` | `drivers.toggle` |

**Create** body example: `{ "items": [{ "name": "John", "mobile": "+15551234567", "truckId": 1 }] }`

Name board delete is blocked when active trucks exist (`NameBoard.HasTrucks`).

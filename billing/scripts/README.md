# Database seed scripts

Scripts are grouped **one folder per table**. Each file contains `INSERT` (or maintenance `DELETE`/`UPDATE`) statements only. Run against your billing database after auth DDL, migrations, and roles/users exist.

## Prerequisites

1. Apply EF migrations (includes `app_field_data_type`, `column_component`, `field_component`):

   ```bash
   cd billing
   dotnet ef database update --project src/Infrastructure/Infrastructure.csproj --startup-project src/Web.Api/Web.Api.csproj
   ```

2. Ensure `app_role`, `app_user`, and login users exist (your usual auth bootstrap).

## Full run order

From the `billing` directory, set `CONN` to your PostgreSQL connection string.

### 1. Sidebar menus

Menus must exist **before** `app_entity_screen` (screens reference `menu_id`).

```bash
CONN="<connection-string>"

psql "$CONN" -f scripts/app_menu/drop_group_label.sql
psql "$CONN" -f scripts/app_menu/seed_billing_menus.sql
```

### 2. Entity registry (types → entity → fields)

```bash
psql "$CONN" -f scripts/app_field_data_type/insert.sql
psql "$CONN" -f scripts/app_entity/insert.sql
psql "$CONN" -f scripts/app_entity_field/name_board.sql
psql "$CONN" -f scripts/app_entity_field/truck.sql
psql "$CONN" -f scripts/app_entity_field/driver.sql
```

### 3. UI screen layout (screen → columns → form fields)

Requires steps 1–2. Links `name_boards` / `trucks` / `drivers` menus to grid + form metadata.

```bash
psql "$CONN" -f scripts/app_entity_screen/insert.sql
psql "$CONN" -f scripts/app_entity_screen_column/name_boards.sql
psql "$CONN" -f scripts/app_entity_screen_column/trucks.sql
psql "$CONN" -f scripts/app_entity_screen_column/drivers.sql
psql "$CONN" -f scripts/app_entity_screen_field/name_boards.sql
psql "$CONN" -f scripts/app_entity_screen_field/trucks.sql
psql "$CONN" -f scripts/app_entity_screen_field/drivers.sql
```

### 4. API endpoint registry

`app_endpoint` has `created_at` only — no `updated_at`.

```bash
psql "$CONN" -f scripts/app_endpoint/auth_access.sql
psql "$CONN" -f scripts/app_endpoint/name_boards.sql
psql "$CONN" -f scripts/app_endpoint/trucks_drivers.sql
psql "$CONN" -f scripts/app_endpoint/menus.sql
```

### 5. Role ↔ endpoint grants

`app_role_endpoint`: `role_id`, `endpoint_id`, `is_enabled` only.

```bash
psql "$CONN" -f scripts/app_role_endpoint/auth_access.sql
psql "$CONN" -f scripts/app_role_endpoint/name_boards_admin.sql
psql "$CONN" -f scripts/app_role_endpoint/trucks_drivers_admin.sql
psql "$CONN" -f scripts/app_role_endpoint/menus_admin.sql
```

### 6. Restart API

Restart the API (or wait ~5 minutes) after changing `app_endpoint` rows so `EndpointAccessCache` refreshes.

## Optional maintenance

```bash
psql "$CONN" -f scripts/app_endpoint/remove_masters_lookup.sql
```

Manual DDL upgrade (only if not using EF migrations):

```bash
psql "$CONN" -f scripts/app_entity_registry/migrate_field_data_type_and_components.sql
```

## Screen metadata API

After steps 1–3, verify:

```http
GET /api/screens/by-menu/name_boards
GET /api/screens/by-menu/trucks
GET /api/screens/by-menu/drivers
```

Endpoint code: `screens.get-by-menu` (seeded in `app_endpoint/auth_access.sql`, granted in `app_role_endpoint/auth_access.sql`).

## Quick copy-paste (all seeds)

Assumes migrations + auth users already exist.

```bash
CONN="<connection-string>"

psql "$CONN" -f scripts/app_menu/drop_group_label.sql
psql "$CONN" -f scripts/app_menu/seed_billing_menus.sql

psql "$CONN" -f scripts/app_field_data_type/insert.sql
psql "$CONN" -f scripts/app_entity/insert.sql
psql "$CONN" -f scripts/app_entity_field/name_board.sql
psql "$CONN" -f scripts/app_entity_field/truck.sql
psql "$CONN" -f scripts/app_entity_field/driver.sql

psql "$CONN" -f scripts/app_entity_screen/insert.sql
psql "$CONN" -f scripts/app_entity_screen_column/name_boards.sql
psql "$CONN" -f scripts/app_entity_screen_column/trucks.sql
psql "$CONN" -f scripts/app_entity_screen_column/drivers.sql
psql "$CONN" -f scripts/app_entity_screen_field/name_boards.sql
psql "$CONN" -f scripts/app_entity_screen_field/trucks.sql
psql "$CONN" -f scripts/app_entity_screen_field/drivers.sql

psql "$CONN" -f scripts/app_endpoint/auth_access.sql
psql "$CONN" -f scripts/app_endpoint/name_boards.sql
psql "$CONN" -f scripts/app_endpoint/trucks_drivers.sql
psql "$CONN" -f scripts/app_endpoint/menus.sql

psql "$CONN" -f scripts/app_role_endpoint/auth_access.sql
psql "$CONN" -f scripts/app_role_endpoint/name_boards_admin.sql
psql "$CONN" -f scripts/app_role_endpoint/trucks_drivers_admin.sql
psql "$CONN" -f scripts/app_role_endpoint/menus_admin.sql
```

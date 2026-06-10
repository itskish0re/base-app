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

Existing databases that still use plural `menu_code` / `route_path` values:

```bash
psql "$CONN" -f scripts/app_menu/migrate_menu_codes_to_singular.sql
```

### 2. Entity registry (types → entity → fields)

```bash
psql "$CONN" -f scripts/app_field_data_type/insert.sql
psql "$CONN" -f scripts/app_entity/insert.sql
psql "$CONN" -f scripts/app_entity_field/name_board.sql
psql "$CONN" -f scripts/app_entity_field/truck.sql
```

### 3. UI screen layout (screen → columns → form fields)

Requires steps 1–2. Links `name_board` / `truck` menus to grid + form metadata.

```bash
psql "$CONN" -f scripts/app_entity_screen/insert.sql
psql "$CONN" -f scripts/app_entity_screen_column/name_boards.sql
psql "$CONN" -f scripts/app_entity_screen_column/trucks.sql
psql "$CONN" -f scripts/app_entity_screen_field/name_boards.sql
psql "$CONN" -f scripts/app_entity_screen_field/trucks.sql
```

### 4. API endpoint registry

`app_endpoint` has `created_at` only — no `updated_at`.

```bash
psql "$CONN" -f scripts/app_endpoint/auth_access.sql
psql "$CONN" -f scripts/app_endpoint/name_boards.sql
psql "$CONN" -f scripts/app_endpoint/trucks.sql
psql "$CONN" -f scripts/app_endpoint/menus.sql
```

### 5. Role ↔ endpoint grants

`app_role_endpoint`: `role_id`, `endpoint_id`, `is_enabled` only.

```bash
psql "$CONN" -f scripts/app_role_endpoint/auth_access.sql
psql "$CONN" -f scripts/app_role_endpoint/name_boards_admin.sql
psql "$CONN" -f scripts/app_role_endpoint/trucks_admin.sql
psql "$CONN" -f scripts/app_role_endpoint/menus_admin.sql
```

### 5b. Transaction tables + views

After EF migration `AddBillsAndLoads` (creates `bills` / `loads`):

```bash
psql "$CONN" -f scripts/views/v_bills.sql
psql "$CONN" -f scripts/views/v_loads.sql
```

Or one-shot temp seeds (run once, then delete):

```bash
psql "$CONN" -f scripts/temp/bills_entity_seed.sql
psql "$CONN" -f scripts/temp/loads_entity_seed.sql
```

Registry scripts (incremental):

```bash
psql "$CONN" -f scripts/app_entity_field/bills.sql
psql "$CONN" -f scripts/app_entity_field/loads.sql
psql "$CONN" -f scripts/app_entity_screen_column/bills.sql
psql "$CONN" -f scripts/app_entity_screen_column/loads.sql
psql "$CONN" -f scripts/app_endpoint/bills.sql
psql "$CONN" -f scripts/app_endpoint/loads.sql
psql "$CONN" -f scripts/app_role_endpoint/bills_admin.sql
psql "$CONN" -f scripts/app_role_endpoint/loads_admin.sql
```

The API fails on startup if `v_bills` or `v_loads` is missing.

### 6. Restart API

Restart the API (or wait ~5 minutes) after changing `app_endpoint` rows so `EndpointAccessCache` refreshes.

### 7. Master data (name boards + trucks from CSV)

Seeds business rows from `Trucks_details.csv` at the repo root. Run **name boards first** (trucks reference `name_board_id` via `code`).

```bash
psql "$CONN" -f scripts/name_board/seed_from_trucks_csv.sql
psql "$CONN" -f scripts/truck/seed_from_trucks_csv.sql
```

If trucks were seeded earlier with spaced numbers, normalize once before re-seeding:

```bash
psql "$CONN" -f scripts/truck/migrate_normalize_truck_numbers.sql
```

Remove erroneous **Cancel** placeholder rows (from bad CSV import) in an existing database:

```bash
psql "$CONN" -f scripts/temp/remove_cancel_name_board_and_truck.sql
```

To regenerate after editing the CSV:

```bash
python scripts/_generate_trucks_seed.py
```

## Optional maintenance

```bash
psql "$CONN" -f scripts/app_endpoint/remove_masters_lookup.sql
```

Remove driver master from an existing database (metadata, menus, endpoints, `driver` table):

```bash
psql "$CONN" -f scripts/driver/remove_driver.sql
```

Manual DDL upgrade (only if not using EF migrations):

```bash
psql "$CONN" -f scripts/app_entity_registry/migrate_field_data_type_and_components.sql
```

## Screen metadata API

After steps 1–3, verify:

```http
GET /api/screens/by-menu/name_board  → `{ screen, entities: [{ entity, entityFields, columns, formFields }] }`
GET /api/screens/by-menu/truck
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

psql "$CONN" -f scripts/app_entity_screen/insert.sql
psql "$CONN" -f scripts/app_entity_screen_column/name_boards.sql
psql "$CONN" -f scripts/app_entity_screen_column/trucks.sql
psql "$CONN" -f scripts/app_entity_screen_field/name_boards.sql
psql "$CONN" -f scripts/app_entity_screen_field/trucks.sql

psql "$CONN" -f scripts/app_endpoint/auth_access.sql
psql "$CONN" -f scripts/app_endpoint/name_boards.sql
psql "$CONN" -f scripts/app_endpoint/trucks.sql
psql "$CONN" -f scripts/app_endpoint/menus.sql

psql "$CONN" -f scripts/app_role_endpoint/auth_access.sql
psql "$CONN" -f scripts/app_role_endpoint/name_boards_admin.sql
psql "$CONN" -f scripts/app_role_endpoint/trucks_admin.sql
psql "$CONN" -f scripts/app_role_endpoint/menus_admin.sql

psql "$CONN" -f scripts/name_board/seed_from_trucks_csv.sql
psql "$CONN" -f scripts/truck/seed_from_trucks_csv.sql
```

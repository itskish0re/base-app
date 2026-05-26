# Database seed scripts

Scripts are grouped **one folder per table**. Each file contains `INSERT` (or maintenance `DELETE`/`UPDATE`) statements only. Run against your billing database after auth DDL and roles/users exist.

## Run order

```bash
CONN="<connection-string>"

# Registry (masters UI contract)
psql "$CONN" -f scripts/app_entity/insert.sql
psql "$CONN" -f scripts/app_entity_field/name_board.sql
psql "$CONN" -f scripts/app_entity_field/truck.sql
psql "$CONN" -f scripts/app_entity_field/driver.sql

# API endpoint registry (app_endpoint has created_at only — no updated_at)
psql "$CONN" -f scripts/app_endpoint/auth_access.sql
psql "$CONN" -f scripts/app_endpoint/name_boards.sql
psql "$CONN" -f scripts/app_endpoint/trucks_drivers.sql
psql "$CONN" -f scripts/app_endpoint/menus.sql

# Role ↔ endpoint grants (app_role_endpoint: role_id, endpoint_id, is_enabled only)
psql "$CONN" -f scripts/app_role_endpoint/auth_access.sql
psql "$CONN" -f scripts/app_role_endpoint/name_boards_admin.sql
psql "$CONN" -f scripts/app_role_endpoint/trucks_drivers_admin.sql
psql "$CONN" -f scripts/app_role_endpoint/menus_admin.sql
```

Sidebar menus (after `app_menu` schema migrations):

```bash
psql "$CONN" -f scripts/app_menu/drop_group_label.sql
psql "$CONN" -f scripts/app_menu/seed_billing_menus.sql
```

Optional maintenance:

```bash
psql "$CONN" -f scripts/app_endpoint/remove_masters_lookup.sql
```

Restart the API (or wait ~5 minutes) after changing `app_endpoint` rows so `EndpointAccessCache` refreshes.

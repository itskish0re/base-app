-- Flat bills menus: list (`bills`), create (`bills_create`), edit (`bills_edit`) — no parent/child.
-- Run after migrate_bills_menus_parent.sql (or any DB that has bills / bills_list / children).

-- Retire the collapsible parent row (route `#`).
UPDATE app_menu
SET menu_code = 'z_retired_bills_group',
    is_active = false,
    updated_at = NOW()
WHERE menu_code = 'bills'
  AND route_path = '#';

-- Promote list child back to the main `bills` menu.
UPDATE app_menu
SET menu_code = 'bills',
    display_name = 'Bills',
    route_path = '/transactions/bills',
    parent_menu_id = NULL,
    sort_order = 10,
    tooltip = 'Freight bills',
    default_expanded = true,
    menu_group = 'main',
    is_active = true,
    updated_at = NOW()
WHERE menu_code = 'bills_list';

-- If list was never renamed (legacy flat `bills` still on list route), normalize it.
UPDATE app_menu
SET display_name = 'Bills',
    route_path = '/transactions/bills',
    parent_menu_id = NULL,
    sort_order = 10,
    tooltip = 'Freight bills',
    is_active = true,
    updated_at = NOW()
WHERE menu_code = 'bills'
  AND route_path = '/transactions/bills';

-- Deactivate stray list row if both `bills` and `bills_list` exist.
UPDATE app_menu
SET is_active = false,
    menu_code = 'z_retired_bills_list',
    updated_at = NOW()
WHERE menu_code = 'bills_list';

-- Create and edit: top-level menus (not under a parent).
INSERT INTO app_menu (
    menu_code,
    display_name,
    route_path,
    icon,
    parent_menu_id,
    sort_order,
    tooltip,
    default_expanded,
    menu_group,
    is_active,
    created_at,
    updated_at)
SELECT
    v.menu_code,
    v.display_name,
    v.route_path,
    v.icon,
    NULL,
    v.sort_order,
    v.tooltip,
    true,
    'main',
    true,
    NOW(),
    NOW()
FROM (
    VALUES
        ('bills_create', 'Create bill', '/transactions/bills/create', 'receipt', 11, 'Create bill'),
        ('bills_edit', 'Edit bill', '/transactions/bills/edit', 'receipt', 12, 'Edit bill')
) AS v(menu_code, display_name, route_path, icon, sort_order, tooltip)
ON CONFLICT (menu_code) DO UPDATE
SET display_name = EXCLUDED.display_name,
    route_path = EXCLUDED.route_path,
    icon = EXCLUDED.icon,
    parent_menu_id = NULL,
    sort_order = EXCLUDED.sort_order,
    tooltip = EXCLUDED.tooltip,
    default_expanded = true,
    menu_group = 'main',
    is_active = true,
    updated_at = NOW();

UPDATE app_menu
SET parent_menu_id = NULL,
    sort_order = 11,
    updated_at = NOW()
WHERE menu_code = 'bills_create';

UPDATE app_menu
SET parent_menu_id = NULL,
    sort_order = 12,
    updated_at = NOW()
WHERE menu_code = 'bills_edit';

INSERT INTO app_role_menu (role_id, menu_id, is_enabled, is_displayed, created_at, updated_at)
SELECT r.role_id,
       m.menu_id,
       true,
       true,
       NOW(),
       NOW()
FROM app_role r
CROSS JOIN app_menu m
WHERE r.role_code = 'admin'
  AND m.menu_code IN ('bills', 'bills_create', 'bills_edit')
  AND m.is_active = true
ON CONFLICT (role_id, menu_id) DO UPDATE
SET is_enabled = true,
    is_displayed = true,
    updated_at = NOW();

INSERT INTO app_entity_screen (
    entity_id,
    menu_id,
    description,
    is_active,
    created_at,
    updated_at)
SELECT
    e.entity_id,
    m.menu_id,
    v.description,
    true,
    NOW(),
    NOW()
FROM (
    VALUES
        ('bills', 'bills', 'Bills transaction: list grid'),
        ('bills', 'bills_create', 'Bills transaction: create screen'),
        ('bills', 'bills_edit', 'Bills transaction: edit screen')
) AS v(entity_name, menu_code, description)
INNER JOIN app_entity e ON e.entity_name = v.entity_name
INNER JOIN app_menu m ON m.menu_code = v.menu_code AND m.is_active = true
ON CONFLICT (menu_id) DO UPDATE
SET entity_id = EXCLUDED.entity_id,
    description = EXCLUDED.description,
    is_active = true,
    updated_at = NOW();

-- Drop entity_screen rows tied to retired menus.
UPDATE app_entity_screen es
SET is_active = false,
    updated_at = NOW()
FROM app_menu m
WHERE es.menu_id = m.menu_id
  AND m.menu_code IN ('z_retired_bills_group', 'z_retired_bills_list', 'bills_list')
  AND m.is_active = false;

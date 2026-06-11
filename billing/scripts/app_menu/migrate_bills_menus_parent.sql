-- DEPRECATED: parent/child bills menus. Use migrate_bills_menus_flat.sql instead.
-- Restructure flat `bills` menu into parent + bills_list / bills_create / bills_edit.

-- Rename existing list menu when it is still the legacy flat entry.
UPDATE app_menu child
SET menu_code = 'bills_list',
    display_name = 'List',
    tooltip = 'Bill list',
    sort_order = 11,
    created_at = NOW()
WHERE child.menu_code = 'bills'
  AND child.parent_menu_id IS NULL
  AND NOT EXISTS (SELECT 1 FROM app_menu WHERE menu_code = 'bills_list');

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
    created_at)
SELECT
    'bills',
    'Bills',
    '#',
    'receipt',
    NULL,
    10,
    'Freight bills',
    true,
    'main',
    true,
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM app_menu WHERE menu_code = 'bills' AND parent_menu_id IS NULL);

UPDATE app_menu list_menu
SET parent_menu_id = parent.menu_id,
    sort_order = 10,
    display_name = 'List',
    created_at = NOW()
FROM app_menu parent
WHERE list_menu.menu_code = 'bills_list'
  AND parent.menu_code = 'bills'
  AND parent.parent_menu_id IS NULL;

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
    created_at)
SELECT
    v.menu_code,
    v.display_name,
    v.route_path,
    v.icon,
    p.menu_id,
    v.sort_order,
    v.tooltip,
    true,
    'main',
    true,
    NOW()
FROM (
    VALUES
        ('bills_create', 'Create', '/transactions/bill-create', 'file-plus', 20, 'Create bill'),
        ('bills_edit', 'Edit', '/transactions/bill-edit', 'file-pen', 30, 'Edit bill')
) AS v(menu_code, display_name, route_path, icon, sort_order, tooltip)
INNER JOIN app_menu p ON p.menu_code = 'bills' AND p.parent_menu_id IS NULL
ON CONFLICT (menu_code) DO UPDATE
SET display_name = EXCLUDED.display_name,
    route_path = EXCLUDED.route_path,
    parent_menu_id = EXCLUDED.parent_menu_id,
    sort_order = EXCLUDED.sort_order,
    tooltip = EXCLUDED.tooltip,
    is_active = true,
    created_at = NOW();

INSERT INTO app_role_menu (role_id, menu_id, is_enabled, is_displayed, updated_at)
SELECT r.role_id,
       m.menu_id,
       true,
       true,
       NOW()
FROM app_role r
CROSS JOIN app_menu m
WHERE r.role_code = 'admin'
  AND m.menu_code IN ('bills', 'bills_list', 'bills_create', 'bills_edit')
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
        ('bills', 'bills_list', 'Bills transaction: list grid'),
        ('bills', 'bills_create', 'Bills transaction: create screen'),
        ('bills', 'bills_edit', 'Bills transaction: edit screen')
) AS v(entity_name, menu_code, description)
INNER JOIN app_entity e ON e.entity_name = v.entity_name
INNER JOIN app_menu m ON m.menu_code = v.menu_code AND m.is_active = true
ON CONFLICT (menu_id) DO UPDATE
SET
    entity_id = EXCLUDED.entity_id,
    description = EXCLUDED.description,
    is_active = true,
    updated_at = NOW();

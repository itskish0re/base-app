-- Sidebar menus for Billing v3 masters + menu admin.
-- Groups: secondary (name board, truck, driver), config (menus screen).
-- Run after drop_group_label.sql / migration DropAppMenuGroupLabel.

-- Retire legacy demo entries (invoices, customers, settings).
UPDATE app_menu
SET is_active = false,
    updated_at = NOW()
WHERE menu_code IN ('invoices', 'customers', 'settings');

-- Dashboard (main group) at /main/dashboard; app redirects / -> /main/dashboard.
INSERT INTO app_menu (
    menu_code,
    display_name,
    route_path,
    icon,
    parent_menu_id,
    sort_order,
    badge,
    tooltip,
    default_expanded,
    menu_group,
    is_active,
    created_at,
    updated_at)
VALUES (
    'dashboard',
    'Dashboard',
    '/main/dashboard',
    'dashboard',
    NULL,
    10,
    NULL,
    'Billing overview',
    true,
    'main',
    true,
    NOW(),
    NOW())
ON CONFLICT (menu_code) DO UPDATE
SET display_name = EXCLUDED.display_name,
    route_path = EXCLUDED.route_path,
    icon = EXCLUDED.icon,
    parent_menu_id = NULL,
    sort_order = EXCLUDED.sort_order,
    tooltip = EXCLUDED.tooltip,
    default_expanded = EXCLUDED.default_expanded,
    menu_group = EXCLUDED.menu_group,
    is_active = true,
    updated_at = NOW();

-- Menu administration screen (config group). Reuse legacy menu_admin row when present.
UPDATE app_menu
SET menu_code = 'menus',
    display_name = 'Menus',
    route_path = '/admin/menus',
    icon = 'settings',
    parent_menu_id = NULL,
    sort_order = 10,
    tooltip = 'Manage sidebar menus and role access',
    default_expanded = true,
    menu_group = 'config',
    is_active = true,
    updated_at = NOW()
WHERE menu_code IN ('menu_admin', 'menus');

INSERT INTO app_menu (
    menu_code,
    display_name,
    route_path,
    icon,
    parent_menu_id,
    sort_order,
    badge,
    tooltip,
    default_expanded,
    menu_group,
    is_active,
    created_at,
    updated_at)
SELECT
    'menus',
    'Menus',
    '/admin/menus',
    'settings',
    NULL,
    10,
    NULL,
    'Manage sidebar menus and role access',
    true,
    'config',
    true,
    NOW(),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM app_menu WHERE menu_code = 'menus');

-- Master screens (secondary group).
INSERT INTO app_menu (
    menu_code,
    display_name,
    route_path,
    icon,
    parent_menu_id,
    sort_order,
    badge,
    tooltip,
    default_expanded,
    menu_group,
    is_active,
    created_at,
    updated_at)
VALUES
    (
        'name_boards',
        'Name Board',
        '/masters/name-boards',
        'nameboard',
        NULL,
        10,
        NULL,
        'Name board master',
        true,
        'secondary',
        true,
        NOW(),
        NOW()),
    (
        'trucks',
        'Truck',
        '/masters/trucks',
        'truck',
        NULL,
        20,
        NULL,
        'Truck master',
        true,
        'secondary',
        true,
        NOW(),
        NOW()),
    (
        'drivers',
        'Driver',
        '/masters/drivers',
        'driver',
        NULL,
        30,
        NULL,
        'Driver master',
        true,
        'secondary',
        true,
        NOW(),
        NOW())
ON CONFLICT (menu_code) DO UPDATE
SET display_name = EXCLUDED.display_name,
    route_path = EXCLUDED.route_path,
    icon = EXCLUDED.icon,
    parent_menu_id = NULL,
    sort_order = EXCLUDED.sort_order,
    tooltip = EXCLUDED.tooltip,
    default_expanded = EXCLUDED.default_expanded,
    menu_group = EXCLUDED.menu_group,
    is_active = true,
    updated_at = NOW();

-- Ensure admin role can see new menus (adjust role_code if yours differs).
INSERT INTO app_role_menu (role_id, menu_id, is_enabled, is_displayed, created_at, updated_at)
SELECT r.role_id,
       m.menu_id,
       true,
       true,
       NOW(),
       NOW()
FROM app_role r
INNER JOIN app_menu m ON m.menu_code IN ('dashboard', 'menus', 'name_boards', 'trucks', 'drivers')
WHERE r.role_code = 'admin'
  AND m.is_active = true
ON CONFLICT (role_id, menu_id) DO UPDATE
SET is_enabled = true,
    is_displayed = true,
    updated_at = NOW();

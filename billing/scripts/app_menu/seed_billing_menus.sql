-- Sidebar menus for Billing v3 masters + menu admin.
-- Groups: secondary (name board, truck), config (menus screen).
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
SET menu_code = 'menu',
    display_name = 'Menus',
    route_path = '/admin/menu',
    icon = 'settings',
    parent_menu_id = NULL,
    sort_order = 10,
    tooltip = 'Manage sidebar menus and role access',
    default_expanded = true,
    menu_group = 'config',
    is_active = true,
    updated_at = NOW()
WHERE menu_code IN ('menu_admin', 'menus', 'menu');

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
    'menu',
    'Menus',
    '/admin/menu',
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
WHERE NOT EXISTS (SELECT 1 FROM app_menu WHERE menu_code = 'menu');

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
        'name_board',
        'Name Board',
        '/masters/name-board',
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
        'truck',
        'Truck',
        '/masters/truck',
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
        'location',
        'Location',
        '/masters/location',
        'map-pin',
        NULL,
        30,
        NULL,
        'Location master',
        true,
        'secondary',
        true,
        NOW(),
        NOW()),
    (
        'party',
        'Party',
        '/masters/party',
        'users',
        NULL,
        40,
        NULL,
        'Party master',
        true,
        'secondary',
        true,
        NOW(),
        NOW()),
    (
        'goods',
        'Goods',
        '/masters/goods',
        'package',
        NULL,
        50,
        NULL,
        'Goods master',
        true,
        'secondary',
        true,
        NOW(),
        NOW()),
    (
        'unit',
        'Unit',
        '/masters/unit',
        'ruler',
        NULL,
        60,
        NULL,
        'Unit master',
        true,
        'secondary',
        true,
        NOW(),
        NOW()),
    (
        'financial_year',
        'Financial Year',
        '/masters/financial-year',
        'calendar',
        NULL,
        70,
        NULL,
        'Financial year master',
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
INNER JOIN app_menu m ON m.menu_code IN ('dashboard', 'menu', 'name_board', 'truck', 'location', 'party', 'goods', 'unit', 'financial_year')
WHERE r.role_code = 'admin'
  AND m.is_active = true
ON CONFLICT (role_id, menu_id) DO UPDATE
SET is_enabled = true,
    is_displayed = true,
    updated_at = NOW();

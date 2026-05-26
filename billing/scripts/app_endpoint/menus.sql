-- app_endpoint — app_menu administration API

INSERT INTO app_endpoint (
    endpoint_code,
    http_method,
    route_pattern,
    access_mode,
    description,
    is_active,
    created_at)
VALUES
    ('menus.list', 'GET', '/api/menus', 'authenticated', 'List sidebar menus', true, NOW()),
    ('menus.get', 'GET', '/api/menus/{id}', 'authenticated', 'Get menu by id', true, NOW()),
    ('menus.create', 'POST', '/api/menus/create', 'authenticated', 'Create one or more menus', true, NOW()),
    ('menus.update', 'POST', '/api/menus/update', 'authenticated', 'Update one or more menus', true, NOW()),
    ('menus.delete', 'POST', '/api/menus/delete', 'authenticated', 'Deactivate one or more menus', true, NOW()),
    ('menus.toggle', 'POST', '/api/menus/toggle', 'authenticated', 'Toggle active state for one or more menus', true, NOW())
ON CONFLICT (endpoint_code) DO UPDATE
SET
    http_method = EXCLUDED.http_method,
    route_pattern = EXCLUDED.route_pattern,
    access_mode = EXCLUDED.access_mode,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active;

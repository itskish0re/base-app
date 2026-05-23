-- Register name_board API endpoints (GET + POST only) and grant admin role access.
-- Run against your Neon billing database after auth tables are seeded.

INSERT INTO app_endpoint (
    endpoint_code,
    http_method,
    route_pattern,
    access_mode,
    description,
    is_active,
    created_at,
    updated_at)
VALUES
    ('name-boards.list', 'GET', '/api/name-boards', 'authenticated', 'List name boards', true, NOW(), NOW()),
    ('name-boards.get', 'GET', '/api/name-boards/{id}', 'authenticated', 'Get name board by id', true, NOW(), NOW()),
    ('name-boards.create', 'POST', '/api/name-boards/create', 'authenticated', 'Create one or more name boards', true, NOW(), NOW()),
    ('name-boards.update', 'POST', '/api/name-boards/update', 'authenticated', 'Update one or more name boards', true, NOW(), NOW()),
    ('name-boards.delete', 'POST', '/api/name-boards/delete', 'authenticated', 'Soft-delete one or more name boards', true, NOW(), NOW()),
    ('name-boards.toggle', 'POST', '/api/name-boards/toggle', 'authenticated', 'Toggle enabled state for one or more name boards', true, NOW(), NOW())
ON CONFLICT (endpoint_code) DO NOTHING;

INSERT INTO app_role_endpoint (role_id, endpoint_id, is_enabled, created_at, updated_at)
SELECT r.role_id, e.endpoint_id, true, NOW(), NOW()
FROM app_role r
INNER JOIN app_endpoint e ON e.endpoint_code LIKE 'name-boards.%'
WHERE r.role_code = 'admin'
ON CONFLICT (role_id, endpoint_id) DO NOTHING;

-- Update name_board endpoints after migrating from PUT/DELETE to POST batch routes.
-- Run this if you already executed the original seed-name-board-endpoints.sql.

UPDATE app_endpoint
SET
    http_method = 'POST',
    route_pattern = '/api/name-boards/create',
    description = 'Create one or more name boards',
    updated_at = NOW()
WHERE endpoint_code = 'name-boards.create';

UPDATE app_endpoint
SET
    http_method = 'POST',
    route_pattern = '/api/name-boards/update',
    description = 'Update one or more name boards',
    updated_at = NOW()
WHERE endpoint_code = 'name-boards.update';

UPDATE app_endpoint
SET
    http_method = 'POST',
    route_pattern = '/api/name-boards/delete',
    description = 'Soft-delete one or more name boards',
    updated_at = NOW()
WHERE endpoint_code = 'name-boards.delete';

-- Rename legacy enable-disable endpoint if present.
UPDATE app_endpoint
SET
    endpoint_code = 'name-boards.toggle',
    http_method = 'POST',
    route_pattern = '/api/name-boards/toggle',
    description = 'Toggle enabled state for one or more name boards',
    updated_at = NOW()
WHERE endpoint_code = 'name-boards.enable-disable';

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
    ('name-boards.toggle', 'POST', '/api/name-boards/toggle', 'authenticated', 'Toggle enabled state for one or more name boards', true, NOW(), NOW())
ON CONFLICT (endpoint_code) DO UPDATE
SET
    http_method = EXCLUDED.http_method,
    route_pattern = EXCLUDED.route_pattern,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- GET endpoints unchanged; ensure they exist if missing.
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
    ('name-boards.get', 'GET', '/api/name-boards/{id}', 'authenticated', 'Get name board by id', true, NOW(), NOW())
ON CONFLICT (endpoint_code) DO NOTHING;

-- Grant admin access to any new endpoints not yet linked.
INSERT INTO app_role_endpoint (role_id, endpoint_id, is_enabled, created_at, updated_at)
SELECT r.role_id, e.endpoint_id, true, NOW(), NOW()
FROM app_role r
INNER JOIN app_endpoint e ON e.endpoint_code LIKE 'name-boards.%'
WHERE r.role_code = 'admin'
ON CONFLICT (role_id, endpoint_id) DO NOTHING;

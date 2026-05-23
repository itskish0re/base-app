-- Add toggle endpoint (or rename from name-boards.enable-disable).

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

INSERT INTO app_role_endpoint (role_id, endpoint_id, is_enabled, created_at, updated_at)
SELECT r.role_id, e.endpoint_id, true, NOW(), NOW()
FROM app_role r
INNER JOIN app_endpoint e ON e.endpoint_code = 'name-boards.toggle'
WHERE r.role_code = 'admin'
ON CONFLICT (role_id, endpoint_id) DO NOTHING;

-- app_endpoint — name_board master API

INSERT INTO app_endpoint (
    endpoint_code,
    http_method,
    route_pattern,
    access_mode,
    description,
    is_active,
    created_at)
VALUES
    ('name-boards.list', 'GET', '/api/name-boards', 'authenticated', 'List name boards', true, NOW()),
    ('name-boards.get', 'GET', '/api/name-boards/{id}', 'authenticated', 'Get name board by id', true, NOW()),
    ('name-boards.create', 'POST', '/api/name-boards/create', 'authenticated', 'Create one or more name boards', true, NOW()),
    ('name-boards.update', 'POST', '/api/name-boards/update', 'authenticated', 'Update one or more name boards', true, NOW()),
    ('name-boards.delete', 'POST', '/api/name-boards/delete', 'authenticated', 'Soft-delete one or more name boards', true, NOW()),
    ('name-boards.toggle', 'POST', '/api/name-boards/toggle', 'authenticated', 'Toggle enabled state for one or more name boards', true, NOW()),
    ('name-boards.lookup', 'POST', '/api/name-boards/lookup', 'authenticated', 'Name board dropdown lookup list', true, NOW())
ON CONFLICT (endpoint_code) DO UPDATE
SET
    http_method = EXCLUDED.http_method,
    route_pattern = EXCLUDED.route_pattern,
    access_mode = EXCLUDED.access_mode,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active;

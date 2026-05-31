-- app_endpoint — party master APIs

INSERT INTO app_endpoint (
    endpoint_code,
    http_method,
    route_pattern,
    access_mode,
    description,
    is_active,
    created_at)
VALUES
    ('parties.list', 'GET', '/api/parties', 'authenticated', 'List partys', true, NOW()),
    ('parties.get', 'GET', '/api/parties/{id}', 'authenticated', 'Get party by id', true, NOW()),
    ('parties.create', 'POST', '/api/parties/create', 'authenticated', 'Create one or more partys', true, NOW()),
    ('parties.update', 'POST', '/api/parties/update', 'authenticated', 'Update one or more partys', true, NOW()),
    ('parties.delete', 'POST', '/api/parties/delete', 'authenticated', 'Soft-delete one or more partys', true, NOW()),
    ('parties.toggle', 'POST', '/api/parties/toggle', 'authenticated', 'Toggle enabled state for one or more partys', true, NOW()),
    ('parties.lookup', 'POST', '/api/parties/lookup', 'authenticated', 'Party dropdown lookup list', true, NOW())
ON CONFLICT (endpoint_code) DO UPDATE
SET
    http_method = EXCLUDED.http_method,
    route_pattern = EXCLUDED.route_pattern,
    access_mode = EXCLUDED.access_mode,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active;

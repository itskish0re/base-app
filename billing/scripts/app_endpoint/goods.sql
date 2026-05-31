-- app_endpoint — goods master APIs

INSERT INTO app_endpoint (
    endpoint_code,
    http_method,
    route_pattern,
    access_mode,
    description,
    is_active,
    created_at)
VALUES
    ('goods.list', 'GET', '/api/goods', 'authenticated', 'List goodss', true, NOW()),
    ('goods.get', 'GET', '/api/goods/{id}', 'authenticated', 'Get goods by id', true, NOW()),
    ('goods.create', 'POST', '/api/goods/create', 'authenticated', 'Create one or more goodss', true, NOW()),
    ('goods.update', 'POST', '/api/goods/update', 'authenticated', 'Update one or more goodss', true, NOW()),
    ('goods.delete', 'POST', '/api/goods/delete', 'authenticated', 'Soft-delete one or more goodss', true, NOW()),
    ('goods.toggle', 'POST', '/api/goods/toggle', 'authenticated', 'Toggle enabled state for one or more goodss', true, NOW()),
    ('goods.lookup', 'POST', '/api/goods/lookup', 'authenticated', 'Goods dropdown lookup list', true, NOW())
ON CONFLICT (endpoint_code) DO UPDATE
SET
    http_method = EXCLUDED.http_method,
    route_pattern = EXCLUDED.route_pattern,
    access_mode = EXCLUDED.access_mode,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active;

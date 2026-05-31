-- app_endpoint — truck master APIs

INSERT INTO app_endpoint (
    endpoint_code,
    http_method,
    route_pattern,
    access_mode,
    description,
    is_active,
    created_at)
VALUES
    ('trucks.list', 'GET', '/api/trucks', 'authenticated', 'List trucks', true, NOW()),
    ('trucks.get', 'GET', '/api/trucks/{id}', 'authenticated', 'Get truck by id', true, NOW()),
    ('trucks.create', 'POST', '/api/trucks/create', 'authenticated', 'Create one or more trucks', true, NOW()),
    ('trucks.update', 'POST', '/api/trucks/update', 'authenticated', 'Update one or more trucks', true, NOW()),
    ('trucks.delete', 'POST', '/api/trucks/delete', 'authenticated', 'Soft-delete one or more trucks', true, NOW()),
    ('trucks.toggle', 'POST', '/api/trucks/toggle', 'authenticated', 'Toggle enabled state for one or more trucks', true, NOW()),
    ('trucks.lookup', 'POST', '/api/trucks/lookup', 'authenticated', 'Truck dropdown lookup list', true, NOW())
ON CONFLICT (endpoint_code) DO UPDATE
SET
    http_method = EXCLUDED.http_method,
    route_pattern = EXCLUDED.route_pattern,
    access_mode = EXCLUDED.access_mode,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active;

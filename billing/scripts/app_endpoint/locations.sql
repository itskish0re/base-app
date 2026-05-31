-- app_endpoint — location master APIs

INSERT INTO app_endpoint (
    endpoint_code,
    http_method,
    route_pattern,
    access_mode,
    description,
    is_active,
    created_at)
VALUES
    ('locations.list', 'GET', '/api/locations', 'authenticated', 'List locations', true, NOW()),
    ('locations.get', 'GET', '/api/locations/{id}', 'authenticated', 'Get location by id', true, NOW()),
    ('locations.create', 'POST', '/api/locations/create', 'authenticated', 'Create one or more locations', true, NOW()),
    ('locations.update', 'POST', '/api/locations/update', 'authenticated', 'Update one or more locations', true, NOW()),
    ('locations.delete', 'POST', '/api/locations/delete', 'authenticated', 'Soft-delete one or more locations', true, NOW()),
    ('locations.toggle', 'POST', '/api/locations/toggle', 'authenticated', 'Toggle enabled state for one or more locations', true, NOW()),
    ('locations.lookup', 'POST', '/api/locations/lookup', 'authenticated', 'Location dropdown lookup list', true, NOW())
ON CONFLICT (endpoint_code) DO UPDATE
SET
    http_method = EXCLUDED.http_method,
    route_pattern = EXCLUDED.route_pattern,
    access_mode = EXCLUDED.access_mode,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active;

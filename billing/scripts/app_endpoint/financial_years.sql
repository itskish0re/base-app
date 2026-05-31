-- app_endpoint — financial year master APIs

INSERT INTO app_endpoint (
    endpoint_code,
    http_method,
    route_pattern,
    access_mode,
    description,
    is_active,
    created_at)
VALUES
    ('financial_years.list', 'GET', '/api/financial-years', 'authenticated', 'List financial years', true, NOW()),
    ('financial_years.get', 'GET', '/api/financial-years/{id}', 'authenticated', 'Get financial year by id', true, NOW()),
    ('financial_years.create', 'POST', '/api/financial-years/create', 'authenticated', 'Create one or more financial years', true, NOW()),
    ('financial_years.update', 'POST', '/api/financial-years/update', 'authenticated', 'Update one or more financial years', true, NOW()),
    ('financial_years.delete', 'POST', '/api/financial-years/delete', 'authenticated', 'Soft-delete one or more financial years', true, NOW()),
    ('financial_years.toggle', 'POST', '/api/financial-years/toggle', 'authenticated', 'Toggle enabled state for one or more financial years', true, NOW()),
    ('financial_years.lookup', 'POST', '/api/financial-years/lookup', 'authenticated', 'Financial year dropdown lookup list', true, NOW())
ON CONFLICT (endpoint_code) DO UPDATE
SET
    http_method = EXCLUDED.http_method,
    route_pattern = EXCLUDED.route_pattern,
    access_mode = EXCLUDED.access_mode,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active;

-- app_endpoint — bills transaction APIs

INSERT INTO app_endpoint (
    endpoint_code,
    http_method,
    route_pattern,
    access_mode,
    description,
    is_active,
    created_at)
VALUES
    ('bills.list', 'GET', '/api/bills', 'authenticated', 'List bills for selected financial year', true, NOW()),
    ('bills.next-number', 'GET', '/api/bills/next-number', 'authenticated', 'Suggested next bill number for financial year', true, NOW()),
    ('bills.get', 'GET', '/api/bills/{id}', 'authenticated', 'Get bill with active loads', true, NOW()),
    ('bills.save', 'POST', '/api/bills/save', 'authenticated', 'Create or update bill with loads', true, NOW()),
    ('bills.cancel', 'POST', '/api/bills/cancel', 'authenticated', 'Cancel a bill', true, NOW())
ON CONFLICT (endpoint_code) DO UPDATE
SET
    http_method = EXCLUDED.http_method,
    route_pattern = EXCLUDED.route_pattern,
    access_mode = EXCLUDED.access_mode,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active;

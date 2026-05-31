-- app_endpoint — unit master APIs

INSERT INTO app_endpoint (
    endpoint_code,
    http_method,
    route_pattern,
    access_mode,
    description,
    is_active,
    created_at)
VALUES
    ('units.list', 'GET', '/api/units', 'authenticated', 'List units', true, NOW()),
    ('units.get', 'GET', '/api/units/{id}', 'authenticated', 'Get unit by id', true, NOW()),
    ('units.create', 'POST', '/api/units/create', 'authenticated', 'Create one or more units', true, NOW()),
    ('units.update', 'POST', '/api/units/update', 'authenticated', 'Update one or more units', true, NOW()),
    ('units.delete', 'POST', '/api/units/delete', 'authenticated', 'Soft-delete one or more units', true, NOW()),
    ('units.toggle', 'POST', '/api/units/toggle', 'authenticated', 'Toggle enabled state for one or more units', true, NOW()),
    ('units.lookup', 'POST', '/api/units/lookup', 'authenticated', 'Unit dropdown lookup list', true, NOW())
ON CONFLICT (endpoint_code) DO UPDATE
SET
    http_method = EXCLUDED.http_method,
    route_pattern = EXCLUDED.route_pattern,
    access_mode = EXCLUDED.access_mode,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active;

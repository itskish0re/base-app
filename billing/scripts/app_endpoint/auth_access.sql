-- app_endpoint — auth + access navigation

INSERT INTO app_endpoint (
    endpoint_code,
    http_method,
    route_pattern,
    access_mode,
    description,
    is_active,
    created_at)
VALUES
    ('auth.login', 'POST', '/api/auth/login', 'public', 'Sign in', true, NOW()),
    ('auth.refresh', 'POST', '/api/auth/refresh', 'public', 'Refresh access token', true, NOW()),
    ('auth.revoke', 'POST', '/api/auth/revoke', 'authenticated', 'Revoke refresh tokens', true, NOW()),
    ('access.navigation', 'GET', '/api/access/navigation', 'authenticated', 'Sidebar navigation for role', true, NOW())
ON CONFLICT (endpoint_code) DO UPDATE
SET
    http_method = EXCLUDED.http_method,
    route_pattern = EXCLUDED.route_pattern,
    access_mode = EXCLUDED.access_mode,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active;

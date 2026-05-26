-- app_role_endpoint — menu administration (admin role)

INSERT INTO app_role_endpoint (role_id, endpoint_id, is_enabled)
SELECT r.role_id, e.endpoint_id, true
FROM app_role r
INNER JOIN app_endpoint e ON e.endpoint_code LIKE 'menus.%'
WHERE r.role_code = 'admin'
ON CONFLICT (role_id, endpoint_id) DO NOTHING;

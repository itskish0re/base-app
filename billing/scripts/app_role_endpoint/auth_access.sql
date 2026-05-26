-- app_role_endpoint — protected auth + navigation (all roles)

INSERT INTO app_role_endpoint (role_id, endpoint_id, is_enabled)
SELECT r.role_id, e.endpoint_id, true
FROM app_role r
CROSS JOIN app_endpoint e
WHERE e.endpoint_code IN ('auth.revoke', 'access.navigation')
ON CONFLICT (role_id, endpoint_id) DO NOTHING;

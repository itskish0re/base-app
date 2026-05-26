-- Retire generic masters.lookup endpoint (replaced by per-entity lookup).

DELETE FROM app_role_endpoint
WHERE endpoint_id IN (
    SELECT endpoint_id FROM app_endpoint WHERE endpoint_code = 'masters.lookup');

DELETE FROM app_endpoint
WHERE endpoint_code = 'masters.lookup';

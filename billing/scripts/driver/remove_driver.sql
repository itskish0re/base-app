-- Remove driver master from registry, navigation, endpoints, and database table.
-- Run after deploying backend without Driver entity.

-- Screen metadata (columns + form fields)
DELETE FROM app_entity_screen_column
WHERE entity_screen_id IN (
    SELECT s.entity_screen_id
    FROM app_entity_screen s
    INNER JOIN app_menu m ON m.menu_id = s.menu_id
    WHERE m.menu_code = 'driver'
);

DELETE FROM app_entity_screen_field
WHERE entity_screen_id IN (
    SELECT s.entity_screen_id
    FROM app_entity_screen s
    INNER JOIN app_menu m ON m.menu_id = s.menu_id
    WHERE m.menu_code = 'driver'
);

DELETE FROM app_entity_screen
WHERE menu_id IN (SELECT menu_id FROM app_menu WHERE menu_code = 'driver');

-- Entity fields + entity
DELETE FROM app_entity_field
WHERE entity_id IN (SELECT entity_id FROM app_entity WHERE entity_name = 'driver');

DELETE FROM app_entity
WHERE entity_name = 'driver';

-- Role grants + endpoints
DELETE FROM app_role_endpoint
WHERE endpoint_id IN (SELECT endpoint_id FROM app_endpoint WHERE endpoint_code LIKE 'drivers.%');

DELETE FROM app_endpoint
WHERE endpoint_code LIKE 'drivers.%';

-- Menu access + menu
DELETE FROM app_role_menu
WHERE menu_id IN (SELECT menu_id FROM app_menu WHERE menu_code = 'driver');

UPDATE app_menu
SET is_active = false,
    updated_at = NOW()
WHERE menu_code = 'driver';

-- Business table (EF migration also drops this)
DROP TABLE IF EXISTS public.driver;

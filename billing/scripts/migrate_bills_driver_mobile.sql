-- Rename bills.driver_mobile to driver_mobile_1 and add driver_mobile_2.
-- Run after EF migration or standalone.

ALTER TABLE bills
    RENAME COLUMN driver_mobile TO driver_mobile_1;

ALTER TABLE bills
    ADD COLUMN IF NOT EXISTS driver_mobile_2 character varying(32);

UPDATE app_entity_field f
SET field_name = 'driver_mobile_1', updated_at = NOW()
FROM app_entity e
WHERE e.entity_id = f.entity_id
  AND e.entity_name = 'bills'
  AND f.field_name = 'driver_mobile';

UPDATE app_entity_screen_column c
SET display_label = 'Driver Mobile 1', updated_at = NOW()
FROM app_entity_screen s
INNER JOIN app_menu m ON m.menu_id = s.menu_id
INNER JOIN app_entity_field f ON f.entity_field_id = c.entity_field_id
WHERE s.entity_screen_id = c.entity_screen_id
  AND m.menu_code = 'bills'
  AND f.field_name = 'driver_mobile_1';

-- Then run: scripts/views/v_bills.sql, app_entity_field/bills.sql, app_entity_screen_column/bills.sql

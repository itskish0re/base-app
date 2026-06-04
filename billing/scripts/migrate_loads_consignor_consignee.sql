-- Migrate loads.party_id → consignor_id; add consignee_id (party) and as_per_bill.
-- Run after EF migration or standalone on databases with the old loads schema.

ALTER TABLE loads
    RENAME COLUMN party_id TO consignor_id;

ALTER TABLE loads
    ADD COLUMN IF NOT EXISTS as_per_bill boolean NOT NULL DEFAULT false;

ALTER TABLE loads
    ADD COLUMN IF NOT EXISTS consignee_id integer;

UPDATE loads
SET consignee_id = consignor_id
WHERE consignee_id IS NULL;

ALTER TABLE loads
    ALTER COLUMN consignee_id SET NOT NULL;

-- Then run: scripts/views/v_loads.sql, app_entity_field/loads.sql, app_entity_screen_column/loads.sql

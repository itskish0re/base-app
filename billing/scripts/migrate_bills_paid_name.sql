-- Add bills.paid_name (nullable person name for payment).
-- Run after EF migration or standalone.

ALTER TABLE bills
    ADD COLUMN IF NOT EXISTS paid_name character varying(256);

-- Then run: scripts/views/v_bills.sql, app_entity_field/bills.sql, app_entity_screen_column/bills.sql

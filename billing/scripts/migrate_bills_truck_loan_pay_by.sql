-- Convert bills.truck_loan to boolean and add pay_by / paid_mobile.
-- Run after EF migration or standalone on databases with numeric truck_loan.

ALTER TABLE bills
    ALTER COLUMN truck_loan TYPE boolean
    USING (truck_loan <> 0);

ALTER TABLE bills
    ALTER COLUMN truck_loan SET DEFAULT false;

ALTER TABLE bills
    ADD COLUMN IF NOT EXISTS pay_by character varying(16);

ALTER TABLE bills
    ADD COLUMN IF NOT EXISTS paid_mobile character varying(32);

ALTER TABLE bills
    DROP CONSTRAINT IF EXISTS ck_bills_pay_by;

ALTER TABLE bills
    ADD CONSTRAINT ck_bills_pay_by
    CHECK (pay_by IS NULL OR pay_by IN ('upi', 'cash', 'owner'));

-- Then run: scripts/views/v_bills.sql, app_entity_field/bills.sql, app_entity_screen_column/bills.sql

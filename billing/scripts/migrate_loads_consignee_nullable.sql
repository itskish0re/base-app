-- Allow null consignee_id when as_per_bill is true.

ALTER TABLE loads
    ALTER COLUMN consignee_id DROP NOT NULL;

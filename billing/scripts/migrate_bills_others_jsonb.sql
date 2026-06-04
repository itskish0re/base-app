-- Convert bills.others from numeric to jsonb array of { key, value } objects.
-- Run after EF migration or standalone on databases with numeric others.

ALTER TABLE bills
    ALTER COLUMN others DROP DEFAULT;

ALTER TABLE bills
    ALTER COLUMN others TYPE jsonb
    USING (
        CASE
            WHEN others IS NULL OR others = 0 THEN '[]'::jsonb
            ELSE jsonb_build_array(jsonb_build_object('key', 'Other', 'value', others))
        END
    );

ALTER TABLE bills
    ALTER COLUMN others SET DEFAULT '[]'::jsonb;

ALTER TABLE bills
    ALTER COLUMN others SET NOT NULL;

-- Then run: scripts/functions/bill_others_total.sql, scripts/views/v_bills.sql,
-- app_field_data_type/insert.sql, app_entity_field/bills.sql

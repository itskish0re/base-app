-- app_entity_field — bills (table + v_bills columns)

INSERT INTO app_entity_field (
    entity_id,
    field_name,
    field_data_type_id,
    filterable,
    sortable,
    selectable,
    writable,
    is_required,
    min_length,
    max_length,
    default_value,
    created_at,
    updated_at)
SELECT
    e.entity_id,
    v.field_name,
    t.field_data_type_id,
    v.filterable,
    v.sortable,
    v.selectable,
    v.writable,
    v.is_required,
    v.min_length,
    v.max_length,
    v.default_value,
    NOW(),
    NOW()
FROM app_entity e
CROSS JOIN (
    VALUES
        ('bill_id', 'integer', true, true, true, false, false, NULL::int, NULL::int, NULL::text),
        ('bill_number', 'text', true, true, true, true, true, NULL::int, 64, NULL::text),
        ('bill_date', 'date', true, true, true, true, true, NULL::int, NULL::int, NULL::text),
        ('from_id', 'integer', true, false, true, true, true, NULL::int, NULL::int, NULL::text),
        ('from_location_name', 'text', true, true, true, false, false, NULL::int, 256, NULL::text),
        ('truck_id', 'integer', true, false, true, true, true, NULL::int, NULL::int, NULL::text),
        ('truck_number', 'text', true, true, true, false, false, NULL::int, 64, NULL::text),
        ('name_board_name', 'text', true, true, true, false, false, NULL::int, 256, NULL::text),
        ('owner_name', 'text', true, true, true, false, false, NULL::int, 256, NULL::text),
        ('owner_mobile', 'text', true, true, true, false, false, NULL::int, 32, NULL::text),
        ('driver_name', 'text', true, true, true, true, true, NULL::int, 256, NULL::text),
        ('driver_mobile', 'text', true, true, true, true, false, NULL::int, 32, NULL::text),
        ('total_freight', 'numeric', true, true, true, true, false, NULL::int, NULL::int, NULL::text),
        ('commission', 'numeric', true, true, true, true, false, NULL::int, NULL::int, NULL::text),
        ('crossing', 'numeric', true, true, true, true, false, NULL::int, NULL::int, NULL::text),
        ('hand_loan', 'numeric', true, true, true, true, false, NULL::int, NULL::int, NULL::text),
        ('truck_loan', 'boolean', true, true, true, true, false, NULL::int, NULL::int, 'false'::text),
        ('pay_by', 'text', true, true, true, true, false, NULL::int, 16, NULL::text),
        ('paid_name', 'text', true, true, true, true, false, NULL::int, 256, NULL::text),
        ('paid_mobile', 'text', true, true, true, true, false, NULL::int, 32, NULL::text),
        ('office_mamul', 'numeric', true, true, true, true, false, NULL::int, NULL::int, NULL::text),
        ('tapal_mamul', 'numeric', true, true, true, true, false, NULL::int, NULL::int, NULL::text),
        ('diesel', 'numeric', true, true, true, true, false, NULL::int, NULL::int, NULL::text),
        ('others', 'jsonb', true, false, true, true, false, NULL::int, NULL::int, '[]'::text),
        ('total', 'numeric', true, true, true, true, false, NULL::int, NULL::int, NULL::text),
        ('is_cancelled', 'boolean', true, true, true, true, false, NULL::int, NULL::int, 'false'::text),
        ('financial_year_id', 'integer', true, false, true, false, false, NULL::int, NULL::int, NULL::text),
        ('is_enabled', 'boolean', true, false, false, false, false, NULL::int, NULL::int, 'true'::text),
        ('is_active', 'boolean', true, false, false, false, false, NULL::int, NULL::int, 'true'::text),
        ('is_deleted', 'boolean', true, false, false, false, false, NULL::int, NULL::int, 'false'::text),
        ('created_at', 'timestamptz', true, true, true, false, false, NULL::int, NULL::int, NULL::text),
        ('updated_at', 'timestamptz', true, true, true, false, false, NULL::int, NULL::int, NULL::text),
        ('_actions', 'text', false, false, false, false, false, NULL::int, NULL::int, NULL::text)
) AS v(field_name, type_code, filterable, sortable, selectable, writable, is_required, min_length, max_length, default_value)
INNER JOIN app_field_data_type t ON t.type_code = v.type_code
WHERE e.entity_name = 'bills'
ON CONFLICT (entity_id, field_name) DO UPDATE
SET
    field_data_type_id = EXCLUDED.field_data_type_id,
    filterable = EXCLUDED.filterable,
    sortable = EXCLUDED.sortable,
    selectable = EXCLUDED.selectable,
    writable = EXCLUDED.writable,
    is_required = EXCLUDED.is_required,
    updated_at = NOW();

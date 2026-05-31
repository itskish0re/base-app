-- app_entity_field — party

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
        ('party_id', 'integer', true, true, true, false, false, NULL::int, NULL::int, NULL::text),
        ('code', 'text', true, true, true, true, true, NULL::int, 64, NULL::text),
        ('name', 'text', true, true, true, true, true, NULL::int, 256, NULL::text),
        ('is_active', 'boolean', true, true, true, true, false, NULL::int, NULL::int, 'true'::text),
('is_enabled', 'boolean', true, true, true, true, false, NULL::int, NULL::int, 'true'::text),
        ('is_deleted', 'boolean', true, false, false, false, false, NULL::int, NULL::int, 'false'::text),
        ('deleted_at', 'timestamptz', true, true, true, false, false, NULL::int, NULL::int, NULL::text),
        ('created_at', 'timestamptz', true, true, true, false, false, NULL::int, NULL::int, NULL::text),
        ('updated_at', 'timestamptz', true, true, true, false, false, NULL::int, NULL::int, NULL::text),
        ('created_by', 'integer', false, false, true, false, false, NULL::int, NULL::int, NULL::text),
        ('updated_by', 'integer', false, false, true, false, false, NULL::int, NULL::int, NULL::text),
        ('_actions', 'text', false, false, false, false, false, NULL::int, NULL::int, NULL::text)
) AS v(field_name, type_code, filterable, sortable, selectable, writable, is_required, min_length, max_length, default_value)
INNER JOIN app_field_data_type t ON t.type_code = v.type_code
WHERE e.entity_name = 'party'
ON CONFLICT (entity_id, field_name) DO UPDATE
SET
    field_data_type_id = EXCLUDED.field_data_type_id,
    filterable = EXCLUDED.filterable,
    sortable = EXCLUDED.sortable,
    selectable = EXCLUDED.selectable,
    writable = EXCLUDED.writable,
    is_required = EXCLUDED.is_required,
    min_length = EXCLUDED.min_length,
    max_length = EXCLUDED.max_length,
    default_value = EXCLUDED.default_value,
    updated_at = NOW();

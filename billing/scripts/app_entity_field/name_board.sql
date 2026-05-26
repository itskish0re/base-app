-- app_entity_field — name_board

INSERT INTO app_entity_field (
    entity_id,
    field_name,
    data_type,
    filterable,
    sortable,
    selectable,
    writable,
    is_required,
    min_length,
    max_length,
    created_at,
    updated_at)
SELECT
    e.entity_id,
    v.field_name,
    v.data_type,
    v.filterable,
    v.sortable,
    v.selectable,
    v.writable,
    v.is_required,
    v.min_length,
    v.max_length,
    NOW(),
    NOW()
FROM app_entity e
CROSS JOIN (
    VALUES
        ('name_board_id', 'integer', true, true, true, false, false, NULL::int, NULL::int),
        ('name', 'text', true, true, true, true, true, NULL::int, 256),
        ('code', 'text', true, true, true, true, true, NULL::int, 64),
        ('owner_name', 'text', true, true, true, true, true, NULL::int, 256),
        ('owner_phone', 'text', true, true, true, true, false, NULL::int, 32),
        ('is_enabled', 'boolean', true, true, true, true, false, NULL::int, NULL::int),
        ('is_active', 'boolean', true, true, true, true, false, NULL::int, NULL::int),
        ('is_deleted', 'boolean', true, false, false, false, false, NULL::int, NULL::int),
        ('deleted_at', 'timestamptz', true, true, true, false, false, NULL::int, NULL::int),
        ('created_at', 'timestamptz', true, true, true, false, false, NULL::int, NULL::int),
        ('updated_at', 'timestamptz', true, true, true, false, false, NULL::int, NULL::int),
        ('created_by', 'integer', false, false, true, false, false, NULL::int, NULL::int),
        ('updated_by', 'integer', false, false, true, false, false, NULL::int, NULL::int)
) AS v(field_name, data_type, filterable, sortable, selectable, writable, is_required, min_length, max_length)
WHERE e.entity_name = 'name_board'
ON CONFLICT (entity_id, field_name) DO UPDATE
SET
    data_type = EXCLUDED.data_type,
    filterable = EXCLUDED.filterable,
    sortable = EXCLUDED.sortable,
    selectable = EXCLUDED.selectable,
    writable = EXCLUDED.writable,
    is_required = EXCLUDED.is_required,
    min_length = EXCLUDED.min_length,
    max_length = EXCLUDED.max_length,
    updated_at = NOW();

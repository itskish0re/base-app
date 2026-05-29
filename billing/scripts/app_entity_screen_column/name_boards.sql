-- app_entity_screen_column — name_boards grid (column_width_percent of base width 100)

INSERT INTO app_entity_screen_column (
    entity_screen_id,
    entity_field_id,
    display_label,
    is_visible,
    display_order,
    column_width_percent,
    is_pinned,
    align,
    column_component,
    allow_sort,
    is_active,
    created_at,
    updated_at)
SELECT
    s.entity_screen_id,
    f.entity_field_id,
    v.display_label,
    v.is_visible,
    v.display_order,
    v.column_width_percent,
    v.is_pinned,
    v.align,
    v.column_component,
    NULL::boolean,
    true,
    NOW(),
    NOW()
FROM app_entity_screen s
INNER JOIN app_menu m ON m.menu_id = s.menu_id
INNER JOIN app_entity e ON e.entity_id = s.entity_id
CROSS JOIN (
    VALUES
        ('code', 'Code', true, 10, 15, false, 'left', 'text'),
        ('name', 'Name', true, 20, 25, false, 'left', 'text'),
        ('owner_name', 'Owner', true, 30, 25, false, 'left', 'text'),
        ('owner_phone', 'Phone', true, 40, 20, false, 'left', 'text'),
        ('is_enabled', 'Enabled', true, 50, 10, false, 'center', 'boolean'),
        ('is_active', 'Active', true, 60, 10, false, 'center', 'boolean')
) AS v(field_name, display_label, is_visible, display_order, column_width_percent, is_pinned, align, column_component)
INNER JOIN app_entity_field f ON f.entity_id = e.entity_id AND f.field_name = v.field_name
WHERE m.menu_code = 'name_board'
ON CONFLICT (entity_screen_id, entity_field_id) DO UPDATE
SET
    display_label = EXCLUDED.display_label,
    is_visible = EXCLUDED.is_visible,
    display_order = EXCLUDED.display_order,
    column_width_percent = EXCLUDED.column_width_percent,
    is_pinned = EXCLUDED.is_pinned,
    align = EXCLUDED.align,
    column_component = EXCLUDED.column_component,
    is_active = true,
    updated_at = NOW();

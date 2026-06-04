-- app_entity_screen_column — loads grid (v_loads visible columns only)

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
        ('bill_number', 'Bill', true, 10, 5, true, 'left', 'text'),
        ('load_number', 'Load', true, 20, 5, false, 'left', 'text'),
        ('consignor_name', 'Consignor', true, 30, 10, false, 'left', 'text'),
        ('consignee_name', 'Consignee', true, 40, 10, false, 'left', 'text'),
        ('as_per_bill', 'As per bill', true, 45, 6, false, 'center', 'boolean'),
        ('to_location_name', 'To', true, 50, 10, false, 'left', 'text'),
        ('goods_name', 'Goods', true, 60, 10, false, 'left', 'text'),
        ('unit_name', 'Unit', true, 70, 6, false, 'left', 'text'),
        ('weight_or_quantity', 'Weight / Quantity', true, 80, 10, false, 'right', 'text'),
        ('rate_per_unit', 'Rate', true, 90, 6, false, 'right', 'text'),
        ('freight', 'Freight', true, 100, 6, false, 'right', 'text'),
        ('advance', 'Advance', true, 110, 6, false, 'right', 'text'),
        ('topay', 'To Pay', true, 120, 6, false, 'right', 'text'),
        ('balance', 'Balance', true, 130, 6, false, 'right', 'text'),
        ('_actions', 'Actions', true, 999, 5, true, 'left', 'actions')
) AS v(field_name, display_label, is_visible, display_order, column_width_percent, is_pinned, align, column_component)
INNER JOIN app_entity_field f ON f.entity_id = e.entity_id AND f.field_name = v.field_name
WHERE m.menu_code = 'loads'
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

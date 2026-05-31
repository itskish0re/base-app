-- app_entity_screen_field — units form

INSERT INTO app_entity_screen_field (
    entity_screen_id,
    entity_field_id,
    display_label,
    is_visible,
    display_order,
    field_component,
    is_read_only,
    is_active,
    created_at,
    updated_at)
SELECT
    s.entity_screen_id,
    f.entity_field_id,
    v.display_label,
    v.is_visible,
    v.display_order,
    v.field_component,
    v.is_read_only,
    true,
    NOW(),
    NOW()
FROM app_entity_screen s
INNER JOIN app_menu m ON m.menu_id = s.menu_id
INNER JOIN app_entity e ON e.entity_id = s.entity_id
CROSS JOIN (
    VALUES
        ('code', 'Code', true, 20, 'badge', false),
        ('name', 'Name', true, 10, 'text', false),
        ('is_fixed', 'Fixed', true, 30, 'boolean', false)
) AS v(field_name, display_label, is_visible, display_order, field_component, is_read_only)
INNER JOIN app_entity_field f ON f.entity_id = e.entity_id AND f.field_name = v.field_name
WHERE m.menu_code = 'unit'
ON CONFLICT (entity_screen_id, entity_field_id) DO UPDATE
SET
    display_label = EXCLUDED.display_label,
    is_visible = EXCLUDED.is_visible,
    display_order = EXCLUDED.display_order,
    field_component = EXCLUDED.field_component,
    is_read_only = EXCLUDED.is_read_only,
    is_active = true,
    updated_at = NOW();

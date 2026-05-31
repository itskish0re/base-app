-- Hide is_enabled / is_active from grid and column picker (state-only fields).

UPDATE app_entity_screen_column c
SET
    is_visible = false,
    updated_at = NOW()
FROM app_entity_screen s
INNER JOIN app_entity e ON e.entity_id = s.entity_id
INNER JOIN app_entity_field f ON f.entity_id = e.entity_id
WHERE c.entity_screen_id = s.entity_screen_id
  AND c.entity_field_id = f.entity_field_id
  AND f.field_name IN ('is_enabled', 'is_active')
  AND e.entity_name IN ('name_board', 'truck');

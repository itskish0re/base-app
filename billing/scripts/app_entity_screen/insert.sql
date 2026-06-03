-- app_entity_screen — links app_menu to app_entity (one screen per master menu)

INSERT INTO app_entity_screen (
    entity_id,
    menu_id,
    description,
    is_active,
    created_at,
    updated_at)
SELECT
    e.entity_id,
    m.menu_id,
    v.description,
    true,
    NOW(),
    NOW()
FROM (
    VALUES
        ('name_board', 'name_board', 'Name board master: grid + form'),
        ('truck', 'truck', 'Truck master: grid + form'),
        ('location', 'location', 'Location master: grid + form'),
        ('party', 'party', 'Party master: grid + form'),
        ('goods', 'goods', 'Goods master: grid + form'),
        ('unit', 'unit', 'Unit master: grid + form'),
        ('financial_year', 'financial_year', 'Financial year master: grid + form'),
        ('bills', 'bills', 'Bills transaction: list grid'),
        ('bills', 'bills_create', 'Bills transaction: create screen'),
        ('bills', 'bills_edit', 'Bills transaction: edit screen'),
        ('loads', 'loads', 'Loads transaction: grid list')
) AS v(entity_name, menu_code, description)
INNER JOIN app_entity e ON e.entity_name = v.entity_name
INNER JOIN app_menu m ON m.menu_code = v.menu_code AND m.is_active = true
ON CONFLICT (menu_id) DO UPDATE
SET
    entity_id = EXCLUDED.entity_id,
    description = EXCLUDED.description,
    is_active = true,
    updated_at = NOW();

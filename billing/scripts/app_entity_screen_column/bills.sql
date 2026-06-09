-- app_entity_screen_column — bills grid (v_bills visible columns only)

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
        ('bill_number', 'Bill Number', true, 10, 8, true, 'left', 'text'),
        ('bill_date', 'Date', true, 20, 8, false, 'left', 'text'),
        ('from_location_name', 'From', true, 30, 10, false, 'left', 'text'),
        ('truck_number', 'Truck Number', true, 40, 9, false, 'left', 'vehicle_number'),
        ('name_board_name', 'Name Board', true, 50, 10, false, 'left', 'text'),
        ('owner_name', 'Owner', true, 60, 10, false, 'left', 'text'),
        ('owner_mobile', 'Owner Mobile', true, 70, 9, false, 'left', 'mobile'),
        ('driver_name', 'Driver', true, 80, 10, false, 'left', 'text'),
        ('driver_mobile', 'Driver Mobile', true, 90, 9, false, 'left', 'mobile'),
        ('total_freight', 'Total Freight', true, 100, 8, false, 'right', 'text'),
        ('commission', 'Commission', true, 110, 7, false, 'right', 'text'),
        ('crossing', 'Crossing', true, 120, 7, false, 'right', 'text'),
        ('hand_loan', 'Hand Loan', true, 130, 7, false, 'right', 'text'),
        ('truck_loan', 'Truck Loan', true, 140, 7, false, 'center', 'boolean'),
        ('pay_by', 'Pay By', true, 145, 7, false, 'left', 'text'),
        ('paid_name', 'Paid Name', true, 146, 9, false, 'left', 'text'),
        ('paid_mobile', 'Paid Mobile', true, 148, 9, false, 'left', 'mobile'),
        ('office_mamul', 'Office Mamul', true, 150, 9, false, 'right', 'text'),
        ('tapal_mamul', 'Tapal Mamul', true, 160, 7, false, 'right', 'text'),
        ('diesel', 'Diesel', true, 170, 7, false, 'right', 'text'),
        ('others', 'Others', true, 180, 7, false, 'right', 'text'),
        ('total', 'Total', true, 190, 8, false, 'right', 'text'),
        ('_actions', 'Actions', true, 999, 10, true, 'left', 'actions')
) AS v(field_name, display_label, is_visible, display_order, column_width_percent, is_pinned, align, column_component)
INNER JOIN app_entity_field f ON f.entity_id = e.entity_id AND f.field_name = v.field_name
WHERE m.menu_code = 'bills'
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

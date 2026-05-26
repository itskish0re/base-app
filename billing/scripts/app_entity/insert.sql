-- app_entity — business masters registry (idempotent).

INSERT INTO app_entity (
    entity_name,
    entity_kind,
    persist_mode,
    table_name,
    display_name,
    description,
    created_at,
    updated_at)
VALUES
    ('name_board', 'master', 'ef_core', 'name_board', 'Name Board', 'Master: name boards', NOW(), NOW()),
    ('truck', 'master', 'ef_core', 'truck', 'Truck', 'Master: trucks (belongs to name board)', NOW(), NOW()),
    ('driver', 'master', 'ef_core', 'driver', 'Driver', 'Master: drivers (belongs to truck)', NOW(), NOW())
ON CONFLICT (entity_name) DO UPDATE
SET
    entity_kind = EXCLUDED.entity_kind,
    persist_mode = EXCLUDED.persist_mode,
    table_name = EXCLUDED.table_name,
    display_name = EXCLUDED.display_name,
    description = EXCLUDED.description,
    updated_at = NOW();

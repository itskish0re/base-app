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
    ('location', 'master', 'ef_core', 'location', 'Location', 'Master: locations', NOW(), NOW()),
    ('party', 'master', 'ef_core', 'party', 'Party', 'Master: parties', NOW(), NOW()),
    ('goods', 'master', 'ef_core', 'goods', 'Goods', 'Master: goods', NOW(), NOW()),
    ('unit', 'master', 'ef_core', 'unit', 'Unit', 'Master: units of measure', NOW(), NOW()),
    ('financial_year', 'master', 'ef_core', 'financial_year', 'Financial Year', 'Master: financial years', NOW(), NOW()),
    ('bills', 'transaction', 'ef_core', 'bills', 'Bills', 'Transaction: freight bills', NOW(), NOW()),
    ('loads', 'transaction', 'ef_core', 'loads', 'Loads', 'Transaction: bill line items', NOW(), NOW())
ON CONFLICT (entity_name) DO UPDATE
SET
    entity_kind = EXCLUDED.entity_kind,
    persist_mode = EXCLUDED.persist_mode,
    table_name = EXCLUDED.table_name,
    display_name = EXCLUDED.display_name,
    description = EXCLUDED.description,
    updated_at = NOW();

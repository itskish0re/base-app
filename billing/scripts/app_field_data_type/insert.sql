-- app_field_data_type — canonical field storage types for app_entity_field

INSERT INTO app_field_data_type (
    type_code,
    display_name,
    description,
    sort_order,
    is_active,
    created_at,
    updated_at)
VALUES
    ('text', 'Text', 'Variable-length string', 10, true, NOW(), NOW()),
    ('boolean', 'Boolean', 'True/false flag', 20, true, NOW(), NOW()),
    ('integer', 'Integer', '32-bit signed integer', 30, true, NOW(), NOW()),
    ('bigint', 'Big integer', '64-bit signed integer', 40, true, NOW(), NOW()),
    ('numeric', 'Numeric', 'Arbitrary-precision decimal', 50, true, NOW(), NOW()),
    ('timestamptz', 'Timestamp (TZ)', 'Timestamp with time zone', 60, true, NOW(), NOW()),
    ('uuid', 'UUID', 'Universally unique identifier', 70, true, NOW(), NOW()),
    ('date', 'Date', 'Calendar date without time', 80, true, NOW(), NOW()),
    ('jsonb', 'JSON', 'JSON document (e.g. key/value arrays)', 90, true, NOW(), NOW())
ON CONFLICT (type_code) DO UPDATE
SET
    display_name = EXCLUDED.display_name,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

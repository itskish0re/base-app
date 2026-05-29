-- Replace column_width / min_width with column_width_percent on app_entity_screen_column.

ALTER TABLE app_entity_screen_column
    ADD COLUMN IF NOT EXISTS column_width_percent integer;

UPDATE app_entity_screen_column
SET column_width_percent = COALESCE(column_width_percent, 20)
WHERE column_width_percent IS NULL;

ALTER TABLE app_entity_screen_column
    DROP COLUMN IF EXISTS column_width,
    DROP COLUMN IF EXISTS min_width;

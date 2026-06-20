-- Add is_important to screen columns and refresh bills/loads grid visibility.

ALTER TABLE app_entity_screen_column
    ADD COLUMN IF NOT EXISTS is_important boolean NOT NULL DEFAULT false;

\ir app_entity_screen_column/bills.sql
\ir app_entity_screen_column/loads.sql

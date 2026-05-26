-- Prefer EF migration DropAppMenuGroupLabel (or run drop_group_label.sql).
-- menu_group: main | secondary | config
ALTER TABLE app_menu
  ADD COLUMN IF NOT EXISTS menu_group varchar(32) NOT NULL DEFAULT 'main';

UPDATE app_menu SET menu_group = 'config' WHERE menu_group = 'projects';
UPDATE app_menu SET menu_group = 'main' WHERE menu_group IS NULL OR menu_group = '';

-- Removes group_label from app_menu (section titles are hardcoded in the sidebar UI).
UPDATE app_menu SET menu_group = 'config' WHERE menu_group = 'projects';

ALTER TABLE app_menu DROP COLUMN IF EXISTS group_label;

-- One-time: plural menu_code → singular (matches seed_billing_menus.sql).
-- Safe to re-run: only updates rows that still use the old codes.

UPDATE app_menu SET menu_code = 'name_board', updated_at = NOW() WHERE menu_code = 'name_boards';
UPDATE app_menu SET menu_code = 'truck', updated_at = NOW() WHERE menu_code = 'trucks';
UPDATE app_menu SET menu_code = 'driver', updated_at = NOW() WHERE menu_code = 'drivers';
UPDATE app_menu SET menu_code = 'menu', updated_at = NOW() WHERE menu_code = 'menus';

UPDATE app_menu SET route_path = '/masters/name-board', updated_at = NOW() WHERE route_path = '/masters/name-boards';
UPDATE app_menu SET route_path = '/masters/truck', updated_at = NOW() WHERE route_path = '/masters/trucks';
UPDATE app_menu SET route_path = '/masters/driver', updated_at = NOW() WHERE route_path = '/masters/drivers';
UPDATE app_menu SET route_path = '/admin/menu', updated_at = NOW() WHERE route_path = '/admin/menus';

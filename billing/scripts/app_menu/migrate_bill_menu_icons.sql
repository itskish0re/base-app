-- Distinct sidebar icons for bill list, create, and edit menus.

UPDATE app_menu
SET icon = 'receipt',
    updated_at = NOW()
WHERE menu_code = 'bills'
  AND icon IS DISTINCT FROM 'receipt';

UPDATE app_menu
SET icon = 'file-plus',
    updated_at = NOW()
WHERE menu_code = 'bills_create'
  AND icon IS DISTINCT FROM 'file-plus';

UPDATE app_menu
SET icon = 'file-pen',
    updated_at = NOW()
WHERE menu_code = 'bills_edit'
  AND icon IS DISTINCT FROM 'file-pen';

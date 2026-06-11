-- Point bill create/edit sidebar menus at dedicated routes (not under /transactions/bills/*).
-- Run on existing databases after deploying the frontend route change.

UPDATE app_menu
SET route_path = '/transactions/bill-create',
    updated_at = NOW()
WHERE menu_code = 'bills_create'
  AND route_path <> '/transactions/bill-create';

UPDATE app_menu
SET route_path = '/transactions/bill-edit',
    updated_at = NOW()
WHERE menu_code = 'bills_edit'
  AND route_path <> '/transactions/bill-edit';

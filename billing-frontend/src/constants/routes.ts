/** Default authenticated landing route after login. */
export const DASHBOARD_ROUTE = '/main/dashboard' as const;

/** App route paths (match `app_menu.route_path`, singular segments). */
export const ROUTES = {
  dashboard: DASHBOARD_ROUTE,
  nameBoard: '/masters/name-board',
  truck: '/masters/truck',
  location: '/masters/location',
  party: '/masters/party',
  goods: '/masters/goods',
  unit: '/masters/unit',
  menuAdmin: '/admin/menu',
  bills: '/transactions/bills',
  billsCreate: '/transactions/bill-create',
  billsEdit: '/transactions/bill-edit/$billId',
  billsEditIndex: '/transactions/bill-edit',
  loads: '/transactions/loads',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

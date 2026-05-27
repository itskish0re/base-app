/** Default authenticated landing route after login. */
export const DASHBOARD_ROUTE = '/main/dashboard' as const;

/** App route paths (match `app_menu.route_path`, singular segments). */
export const ROUTES = {
  dashboard: DASHBOARD_ROUTE,
  nameBoard: '/masters/name-board',
  truck: '/masters/truck',
  driver: '/masters/driver',
  menuAdmin: '/admin/menu',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

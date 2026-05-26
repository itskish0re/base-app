/** Redux reducer keys for per-screen slices (mounted only while the route is active). */
export const SCREEN_KEYS = {
  dashboard: 'dashboard',
  nameBoards: 'nameBoards',
  trucks: 'trucks',
  drivers: 'drivers',
  menus: 'menus',
} as const;

export type ScreenKey = (typeof SCREEN_KEYS)[keyof typeof SCREEN_KEYS];

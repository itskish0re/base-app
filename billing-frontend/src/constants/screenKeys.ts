import { MENU_CODES } from '@/constants/menu';

/** Redux reducer keys for per-screen slices (same values as `MENU_CODES` where applicable). */
export const SCREEN_KEYS = {
  dashboard: MENU_CODES.dashboard,
  nameBoard: MENU_CODES.nameBoard,
  truck: MENU_CODES.truck,
  menu: MENU_CODES.menu,
} as const;

export type ScreenKey = (typeof SCREEN_KEYS)[keyof typeof SCREEN_KEYS];

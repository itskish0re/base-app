import { MENU_CODES } from '@/constants/menu';

/** Redux reducer keys for per-screen slices (same values as `MENU_CODES` where applicable). */
export const SCREEN_KEYS = {
  dashboard: MENU_CODES.dashboard,
  nameBoard: MENU_CODES.nameBoard,
  truck: MENU_CODES.truck,
  location: MENU_CODES.location,
  party: MENU_CODES.party,
  goods: MENU_CODES.goods,
  unit: MENU_CODES.unit,
  financialYear: MENU_CODES.financialYear,
  bills: MENU_CODES.bills,
  billsCreate: MENU_CODES.billsCreate,
  billsEdit: MENU_CODES.billsEdit,
  loads: MENU_CODES.loads,
  menu: MENU_CODES.menu,
} as const;

export type ScreenKey = (typeof SCREEN_KEYS)[keyof typeof SCREEN_KEYS];

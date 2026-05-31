import type { SCREEN_KEYS } from '@/constants/screenKeys';
import type { DashboardScreenState } from './dashboard';
import type { GoodsScreenState } from './goods';
import type { LocationsScreenState } from './locations';
import type { MenusScreenState } from './menus';
import type { NameBoardsScreenState } from './nameBoards';
import type { PartiesScreenState } from './parties';
import type { TrucksScreenState } from './trucks';
import type { UnitsScreenState } from './units';
import type { FinancialYearsScreenState } from './financialYears';

export type { DashboardScreenState } from './dashboard';
export type { GoodsScreenState } from './goods';
export type { LocationsScreenState } from './locations';
export type { MenusScreenState } from './menus';
export type { NameBoardsScreenState } from './nameBoards';
export type { PartiesScreenState } from './parties';
export type { TrucksScreenState } from './trucks';
export type { UnitsScreenState } from './units';
export type { FinancialYearsScreenState } from './financialYears';

export interface ScreenStateByKey {
  [SCREEN_KEYS.dashboard]: DashboardScreenState;
  [SCREEN_KEYS.nameBoard]: NameBoardsScreenState;
  [SCREEN_KEYS.truck]: TrucksScreenState;
  [SCREEN_KEYS.location]: LocationsScreenState;
  [SCREEN_KEYS.party]: PartiesScreenState;
  [SCREEN_KEYS.goods]: GoodsScreenState;
  [SCREEN_KEYS.unit]: UnitsScreenState;
  [SCREEN_KEYS.financialYear]: FinancialYearsScreenState;
  [SCREEN_KEYS.menu]: MenusScreenState;
}

/** Screen keys whose slice includes `table` (data grid state). */
export type ScreenKeyWithTable =
  | typeof SCREEN_KEYS.nameBoard
  | typeof SCREEN_KEYS.truck
  | typeof SCREEN_KEYS.location
  | typeof SCREEN_KEYS.party
  | typeof SCREEN_KEYS.goods
  | typeof SCREEN_KEYS.unit
  | typeof SCREEN_KEYS.financialYear;

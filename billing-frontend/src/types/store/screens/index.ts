import type { SCREEN_KEYS } from '@/constants/screenKeys';
import type { DashboardScreenState } from './dashboard';
import type { MenusScreenState } from './menus';
import type { NameBoardsScreenState } from './nameBoards';
import type { TrucksScreenState } from './trucks';

export type { DashboardScreenState } from './dashboard';
export type { MenusScreenState } from './menus';
export type { NameBoardsScreenState } from './nameBoards';
export type { TrucksScreenState } from './trucks';

export interface ScreenStateByKey {
  [SCREEN_KEYS.dashboard]: DashboardScreenState;
  [SCREEN_KEYS.nameBoard]: NameBoardsScreenState;
  [SCREEN_KEYS.truck]: TrucksScreenState;
  [SCREEN_KEYS.menu]: MenusScreenState;
}

/** Screen keys whose slice includes `table` (data grid state). */
export type ScreenKeyWithTable = typeof SCREEN_KEYS.nameBoard | typeof SCREEN_KEYS.truck;

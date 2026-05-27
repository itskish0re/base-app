import type { SCREEN_KEYS } from '@/constants/screenKeys';
import type { DashboardScreenState } from './dashboard';
import type { DriversScreenState } from './drivers';
import type { MenusScreenState } from './menus';
import type { NameBoardsScreenState } from './nameBoards';
import type { TrucksScreenState } from './trucks';

export type { DashboardScreenState } from './dashboard';
export type { DriversScreenState } from './drivers';
export type { MenusScreenState } from './menus';
export type { NameBoardsScreenState } from './nameBoards';
export type { TrucksScreenState } from './trucks';

export interface ScreenStateByKey {
  [SCREEN_KEYS.dashboard]: DashboardScreenState;
  [SCREEN_KEYS.nameBoard]: NameBoardsScreenState;
  [SCREEN_KEYS.truck]: TrucksScreenState;
  [SCREEN_KEYS.driver]: DriversScreenState;
  [SCREEN_KEYS.menu]: MenusScreenState;
}

import type { Reducer } from '@reduxjs/toolkit';
import { SCREEN_KEYS, type ScreenKey } from '@/store/screenKeys';
import { dashboardScreenReducer, type DashboardScreenState } from '@/store/screens/dashboardSlice';
import { driversScreenReducer, type DriversScreenState } from '@/store/screens/driversSlice';
import { menusScreenReducer, type MenusScreenState } from '@/store/screens/menusSlice';
import { nameBoardsScreenReducer, type NameBoardsScreenState } from '@/store/screens/nameBoardsSlice';
import { trucksScreenReducer, type TrucksScreenState } from '@/store/screens/trucksSlice';

export interface ScreenStateByKey {
  [SCREEN_KEYS.dashboard]: DashboardScreenState;
  [SCREEN_KEYS.nameBoards]: NameBoardsScreenState;
  [SCREEN_KEYS.trucks]: TrucksScreenState;
  [SCREEN_KEYS.drivers]: DriversScreenState;
  [SCREEN_KEYS.menus]: MenusScreenState;
}

export const screenReducerRegistry: { [K in ScreenKey]: Reducer<ScreenStateByKey[K]> } = {
  [SCREEN_KEYS.dashboard]: dashboardScreenReducer,
  [SCREEN_KEYS.nameBoards]: nameBoardsScreenReducer,
  [SCREEN_KEYS.trucks]: trucksScreenReducer,
  [SCREEN_KEYS.drivers]: driversScreenReducer,
  [SCREEN_KEYS.menus]: menusScreenReducer,
};

import type { Reducer } from '@reduxjs/toolkit';
import { SCREEN_KEYS, type ScreenKey } from '@/constants/screenKeys';
import { dashboardScreenReducer } from '@/store/screens/dashboardSlice';
import { driversScreenReducer } from '@/store/screens/driversSlice';
import { menusScreenReducer } from '@/store/screens/menusSlice';
import { nameBoardsScreenReducer } from '@/store/screens/nameBoardsSlice';
import { trucksScreenReducer } from '@/store/screens/trucksSlice';
import type { ScreenStateByKey } from '@/types/store/screens';

export const screenReducerRegistry: { [K in ScreenKey]: Reducer<ScreenStateByKey[K]> } = {
  [SCREEN_KEYS.dashboard]: dashboardScreenReducer,
  [SCREEN_KEYS.nameBoards]: nameBoardsScreenReducer,
  [SCREEN_KEYS.trucks]: trucksScreenReducer,
  [SCREEN_KEYS.drivers]: driversScreenReducer,
  [SCREEN_KEYS.menus]: menusScreenReducer,
};

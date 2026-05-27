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
  [SCREEN_KEYS.nameBoard]: nameBoardsScreenReducer,
  [SCREEN_KEYS.truck]: trucksScreenReducer,
  [SCREEN_KEYS.driver]: driversScreenReducer,
  [SCREEN_KEYS.menu]: menusScreenReducer,
};

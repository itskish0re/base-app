import type { Reducer } from '@reduxjs/toolkit';
import { SCREEN_KEYS, type ScreenKey } from '@/constants/screenKeys';
import { dashboardScreenReducer } from '@/store/screens/dashboardSlice';
import { goodsScreenReducer } from '@/store/screens/goodsSlice';
import { locationsScreenReducer } from '@/store/screens/locationsSlice';
import { menusScreenReducer } from '@/store/screens/menusSlice';
import { nameBoardsScreenReducer } from '@/store/screens/nameBoardsSlice';
import { partiesScreenReducer } from '@/store/screens/partiesSlice';
import { trucksScreenReducer } from '@/store/screens/trucksSlice';
import { unitsScreenReducer } from '@/store/screens/unitsSlice';
import { financialYearsScreenReducer } from '@/store/screens/financialYearsSlice';
import type { ScreenStateByKey } from '@/types/store/screens';

export const screenReducerRegistry: { [K in ScreenKey]: Reducer<ScreenStateByKey[K]> } = {
  [SCREEN_KEYS.dashboard]: dashboardScreenReducer,
  [SCREEN_KEYS.nameBoard]: nameBoardsScreenReducer,
  [SCREEN_KEYS.truck]: trucksScreenReducer,
  [SCREEN_KEYS.location]: locationsScreenReducer,
  [SCREEN_KEYS.party]: partiesScreenReducer,
  [SCREEN_KEYS.goods]: goodsScreenReducer,
  [SCREEN_KEYS.unit]: unitsScreenReducer,
  [SCREEN_KEYS.financialYear]: financialYearsScreenReducer,
  [SCREEN_KEYS.menu]: menusScreenReducer,
};

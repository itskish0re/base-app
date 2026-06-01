import type { UnknownAction } from '@reduxjs/toolkit';
import { SCREEN_KEYS, type ScreenKey } from '@/constants/screenKeys';
import { dashboardScreenActions } from '@/store/screens/dashboardSlice';
import { goodsScreenActions } from '@/store/screens/goodsSlice';
import { locationsScreenActions } from '@/store/screens/locationsSlice';
import { menusScreenActions } from '@/store/screens/menusSlice';
import { nameBoardsScreenActions } from '@/store/screens/nameBoardsSlice';
import { partiesScreenActions } from '@/store/screens/partiesSlice';
import { trucksScreenActions } from '@/store/screens/trucksSlice';
import { unitsScreenActions } from '@/store/screens/unitsSlice';
import { financialYearsScreenActions } from '@/store/screens/financialYearsSlice';
import { billsScreenActions } from '@/store/screens/billsSlice';
import { loadsScreenActions } from '@/store/screens/loadsSlice';

/** Dispatched once when a screen slice is mounted so Redux state exists before selectors run. */
export const screenMountActionsByKey: Record<ScreenKey, () => UnknownAction> = {
  [SCREEN_KEYS.dashboard]: () => dashboardScreenActions.resetScreenState(),
  [SCREEN_KEYS.nameBoard]: () => nameBoardsScreenActions.resetScreenState(),
  [SCREEN_KEYS.truck]: () => trucksScreenActions.resetScreenState(),
  [SCREEN_KEYS.location]: () => locationsScreenActions.resetScreenState(),
  [SCREEN_KEYS.party]: () => partiesScreenActions.resetScreenState(),
  [SCREEN_KEYS.goods]: () => goodsScreenActions.resetScreenState(),
  [SCREEN_KEYS.unit]: () => unitsScreenActions.resetScreenState(),
  [SCREEN_KEYS.financialYear]: () => financialYearsScreenActions.resetScreenState(),
  [SCREEN_KEYS.menu]: () => menusScreenActions.resetScreenState(),
  [SCREEN_KEYS.bills]: () => billsScreenActions.resetScreenState(),
  [SCREEN_KEYS.loads]: () => loadsScreenActions.resetScreenState(),
};

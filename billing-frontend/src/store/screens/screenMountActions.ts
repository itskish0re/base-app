import type { UnknownAction } from '@reduxjs/toolkit';
import { SCREEN_KEYS, type ScreenKey } from '@/constants/screenKeys';
import { dashboardScreenActions } from '@/store/screens/dashboardSlice';
import { driversScreenActions } from '@/store/screens/driversSlice';
import { menusScreenActions } from '@/store/screens/menusSlice';
import { nameBoardsScreenActions } from '@/store/screens/nameBoardsSlice';
import { trucksScreenActions } from '@/store/screens/trucksSlice';

/** Dispatched once when a screen slice is mounted so Redux state exists before selectors run. */
export const screenMountActionsByKey: Record<ScreenKey, () => UnknownAction> = {
  [SCREEN_KEYS.dashboard]: () => dashboardScreenActions.resetScreenState(),
  [SCREEN_KEYS.nameBoard]: () => nameBoardsScreenActions.resetScreenState(),
  [SCREEN_KEYS.truck]: () => trucksScreenActions.resetScreenState(),
  [SCREEN_KEYS.driver]: () => driversScreenActions.resetScreenState(),
  [SCREEN_KEYS.menu]: () => menusScreenActions.resetScreenState(),
};

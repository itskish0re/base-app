import { configureStore, type Reducer } from '@reduxjs/toolkit';
import type { AuthState } from '@/store/authSlice';
import { authReducer } from '@/store/authSlice';
import type { MenuState } from '@/store/menuSlice';
import { menuReducer } from '@/store/menuSlice';
import { createReducerManager } from '@/store/reducerManager';
import type { ScreenStateByKey } from '@/store/screens/registry';
import type { ScreenKey } from '@/store/screenKeys';

const staticReducers = {
  auth: authReducer,
  menu: menuReducer,
};

const reducerManager = createReducerManager(staticReducers);

export const store = configureStore({
  reducer: (state, action) => reducerManager.reduce(state, action),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }),
});

/** Register a screen slice when the route mounts. */
export function injectScreenReducer<K extends ScreenKey>(
  key: K,
  reducer: Reducer<ScreenStateByKey[K]>,
): void {
  reducerManager.add(key, reducer as Reducer);
}

/** Drop a screen slice and its state when the route unmounts. */
export function removeScreenReducer(key: ScreenKey): void {
  reducerManager.remove(key);
}

/** Auth is always present; screen slices exist only while their page is mounted. */
export type RootState = {
  auth: AuthState;
  menu: MenuState;
} & Partial<ScreenStateByKey>;

export type AppDispatch = typeof store.dispatch;

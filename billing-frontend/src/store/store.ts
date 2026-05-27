import { configureStore, type Reducer } from '@reduxjs/toolkit';
import type { ScreenKey } from '@/constants/screenKeys';
import { authReducer } from '@/store/global/authSlice';
import { menuReducer } from '@/store/global/menuSlice';
import { createReducerManager } from '@/store/reducerManager';
import type { ScreenStateByKey } from '@/types/store/screens';
import type { RootState } from '@/types/store/root';

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

export type { RootState };
export type AppDispatch = typeof store.dispatch;

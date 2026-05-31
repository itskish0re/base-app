import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ScreenKeyWithMetadata } from '@/store/screens/screenMetadataActions';
import { clearAuth } from '@/store/global/authSlice';
import type { ScreenMetadataResponse } from '@/types/entity/screen';
import {
  createInitialScreenMetadataState,
  SCREEN_METADATA_LOAD_STATUS,
} from '@/types/store/screen';
import {
  createInitialScreenCacheState,
} from '@/types/store/screenCache';
import type { RootState } from '@/types/store/root';

const initialState = createInitialScreenCacheState();

const screenCacheSlice = createSlice({
  name: 'screenCache',
  initialState,
  reducers: {
    setScreenMetadataLoading(
      state,
      action: PayloadAction<{ screenKey: ScreenKeyWithMetadata }>,
    ) {
      const { screenKey } = action.payload;
      const current = state.metadataByScreenKey[screenKey] ?? createInitialScreenMetadataState();

      state.metadataByScreenKey[screenKey] = {
        ...current,
        status: SCREEN_METADATA_LOAD_STATUS.loading,
        error: null,
      };
    },
    setScreenMetadataSucceeded(
      state,
      action: PayloadAction<{ screenKey: ScreenKeyWithMetadata; data: ScreenMetadataResponse }>,
    ) {
      const { screenKey, data } = action.payload;

      state.metadataByScreenKey[screenKey] = {
        status: SCREEN_METADATA_LOAD_STATUS.succeeded,
        error: null,
        screen: data.screen,
        entities: data.entities,
      };
    },
    setScreenMetadataFailed(
      state,
      action: PayloadAction<{ screenKey: ScreenKeyWithMetadata; error: string }>,
    ) {
      const { screenKey, error } = action.payload;
      const current = state.metadataByScreenKey[screenKey] ?? createInitialScreenMetadataState();

      state.metadataByScreenKey[screenKey] = {
        ...current,
        status: SCREEN_METADATA_LOAD_STATUS.failed,
        error,
      };
    },
    clearScreenMetadata(state, action: PayloadAction<{ screenKey: ScreenKeyWithMetadata }>) {
      delete state.metadataByScreenKey[action.payload.screenKey];
    },
    resetScreenCache: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(clearAuth, () => initialState);
  },
});

export const screenCacheActions = screenCacheSlice.actions;
export const screenCacheReducer = screenCacheSlice.reducer;

export function selectScreenMetadataState(
  state: RootState,
  screenKey: ScreenKeyWithMetadata,
) {
  return state.screenCache.metadataByScreenKey[screenKey] ?? createInitialScreenMetadataState();
}

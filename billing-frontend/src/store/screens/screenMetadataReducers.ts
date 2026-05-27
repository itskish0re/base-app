import type { PayloadAction } from '@reduxjs/toolkit';
import type { ScreenMetadataResponse } from '@/types/entity/screen';
import {
  SCREEN_METADATA_LOAD_STATUS,
  createInitialScreenMetadataState,
  type ScreenMetadataState,
} from '@/types/store/screen';

export type SliceWithScreenMetadata = { metadata: ScreenMetadataState };

export function createScreenMetadataReducers() {
  return {
    setScreenMetadataLoading(state: SliceWithScreenMetadata) {
      state.metadata.status = SCREEN_METADATA_LOAD_STATUS.loading;
      state.metadata.error = null;
    },
    setScreenMetadataSucceeded(
      state: SliceWithScreenMetadata,
      action: PayloadAction<ScreenMetadataResponse>,
    ) {
      state.metadata.status = SCREEN_METADATA_LOAD_STATUS.succeeded;
      state.metadata.screen = action.payload.screen;
      state.metadata.entities = action.payload.entities;
      state.metadata.error = null;
    },
    setScreenMetadataFailed(state: SliceWithScreenMetadata, action: PayloadAction<string>) {
      state.metadata.status = SCREEN_METADATA_LOAD_STATUS.failed;
      state.metadata.error = action.payload;
    },
    resetScreenMetadata(state: SliceWithScreenMetadata) {
      state.metadata = createInitialScreenMetadataState();
    },
  };
}

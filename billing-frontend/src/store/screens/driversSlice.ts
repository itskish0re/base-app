import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  createInitialDataTableState,
  type DataTableState,
} from '@/components/derived/data-table';
import { SCREEN_KEYS } from '@/constants/screenKeys';
import { createScreenMetadataReducers } from '@/store/screens/screenMetadataReducers';
import type { DriversScreenState } from '@/types/store/screens/drivers';
import { createInitialScreenMetadataState } from '@/types/store/screen';

const initialState: DriversScreenState = {
  table: createInitialDataTableState(),
  metadata: createInitialScreenMetadataState(),
};

const driversSlice = createSlice({
  name: SCREEN_KEYS.driver,
  initialState,
  reducers: {
    setTable(state, action: PayloadAction<DataTableState>) {
      state.table = action.payload;
    },
    resetScreenState: () => initialState,
    ...createScreenMetadataReducers(),
  },
});

export const driversScreenActions = driversSlice.actions;
export const driversScreenReducer = driversSlice.reducer;

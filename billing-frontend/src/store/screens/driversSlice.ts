import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  createInitialDataTableState,
  type DataTableState,
} from '@/components/derived/data-table';
import { SCREEN_KEYS } from '@/constants/screenKeys';
import type { DriversScreenState } from '@/types/store/screens/drivers';

const initialState: DriversScreenState = {
  table: createInitialDataTableState(),
};

const driversSlice = createSlice({
  name: SCREEN_KEYS.driver,
  initialState,
  reducers: {
    setTable(state, action: PayloadAction<DataTableState>) {
      state.table = action.payload;
    },
    resetScreenState: () => initialState,
  },
});

export const driversScreenActions = driversSlice.actions;
export const driversScreenReducer = driversSlice.reducer;

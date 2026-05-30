import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  createInitialDataTableState,
  type DataTableState,
} from '@/components/derived/data-table';
import { SCREEN_KEYS } from '@/constants/screenKeys';
import type { TrucksScreenState } from '@/types/store/screens/trucks';

const initialState: TrucksScreenState = {
  table: createInitialDataTableState(),
};

const trucksSlice = createSlice({
  name: SCREEN_KEYS.truck,
  initialState,
  reducers: {
    setTable(state, action: PayloadAction<DataTableState>) {
      state.table = action.payload;
    },
    resetScreenState: () => initialState,
  },
});

export const trucksScreenActions = trucksSlice.actions;
export const trucksScreenReducer = trucksSlice.reducer;

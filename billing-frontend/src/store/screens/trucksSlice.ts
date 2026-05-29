import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  createInitialDataTableState,
  type DataTableState,
} from '@/components/derived/data-table';
import { SCREEN_KEYS } from '@/constants/screenKeys';
import { createScreenMetadataReducers } from '@/store/screens/screenMetadataReducers';
import type { TrucksScreenState } from '@/types/store/screens/trucks';
import { createInitialScreenMetadataState } from '@/types/store/screen';

const initialState: TrucksScreenState = {
  table: createInitialDataTableState(),
  metadata: createInitialScreenMetadataState(),
};

const trucksSlice = createSlice({
  name: SCREEN_KEYS.truck,
  initialState,
  reducers: {
    setTable(state, action: PayloadAction<DataTableState>) {
      state.table = action.payload;
    },
    resetScreenState: () => initialState,
    ...createScreenMetadataReducers(),
  },
});

export const trucksScreenActions = trucksSlice.actions;
export const trucksScreenReducer = trucksSlice.reducer;

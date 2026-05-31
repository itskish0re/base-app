import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createInitialDataTableState } from '@/components/derived/data-table';
import { SCREEN_KEYS } from '@/constants/screenKeys';
import type { DataTableState } from '@/components/derived/data-table';
import type { LocationsScreenState } from '@/types/store/screens/locations';

const initialState: LocationsScreenState = {
  table: createInitialDataTableState(),
};

const slice = createSlice({
  name: SCREEN_KEYS.location,
  initialState,
  reducers: {
    setTable(state, action: PayloadAction<DataTableState>) {
      state.table = action.payload;
    },
    resetScreenState() {
      return initialState;
    },
  },
});

export const locationsScreenActions = slice.actions;
export const locationsScreenReducer = slice.reducer;

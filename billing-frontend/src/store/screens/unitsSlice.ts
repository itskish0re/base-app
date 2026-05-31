import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createInitialDataTableState } from '@/components/derived/data-table';
import { SCREEN_KEYS } from '@/constants/screenKeys';
import type { DataTableState } from '@/components/derived/data-table';
import type { UnitsScreenState } from '@/types/store/screens/units';

const initialState: UnitsScreenState = {
  table: createInitialDataTableState(),
};

const slice = createSlice({
  name: SCREEN_KEYS.unit,
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

export const unitsScreenActions = slice.actions;
export const unitsScreenReducer = slice.reducer;

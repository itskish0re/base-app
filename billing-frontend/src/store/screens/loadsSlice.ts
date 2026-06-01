import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createInitialDataTableState } from '@/components/derived/data-table';
import { SCREEN_KEYS } from '@/constants/screenKeys';
import type { DataTableState } from '@/components/derived/data-table';
import type { LoadsScreenState } from '@/types/store/screens/loads';

const initialState: LoadsScreenState = {
  table: createInitialDataTableState(),
};

const slice = createSlice({
  name: SCREEN_KEYS.loads,
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

export const loadsScreenActions = slice.actions;
export const loadsScreenReducer = slice.reducer;

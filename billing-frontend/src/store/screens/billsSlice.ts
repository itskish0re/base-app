import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createInitialDataTableState } from '@/components/derived/data-table';
import { SCREEN_KEYS } from '@/constants/screenKeys';
import type { DataTableState } from '@/components/derived/data-table';
import type { BillsScreenState } from '@/types/store/screens/bills';

const initialState: BillsScreenState = {
  table: createInitialDataTableState(),
};

const slice = createSlice({
  name: SCREEN_KEYS.bills,
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

export const billsScreenActions = slice.actions;
export const billsScreenReducer = slice.reducer;

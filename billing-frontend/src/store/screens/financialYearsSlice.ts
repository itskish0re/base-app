import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createInitialDataTableState } from '@/components/derived/data-table';
import { SCREEN_KEYS } from '@/constants/screenKeys';
import type { DataTableState } from '@/components/derived/data-table';
import type { FinancialYearsScreenState } from '@/types/store/screens/financialYears';

const initialState: FinancialYearsScreenState = {
  table: createInitialDataTableState(),
};

const slice = createSlice({
  name: SCREEN_KEYS.financialYear,
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

export const financialYearsScreenActions = slice.actions;
export const financialYearsScreenReducer = slice.reducer;

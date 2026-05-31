import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import { resolveInitialFinancialYearId } from '@/lib/financialYearSelection';
import {
  clearSelectedFinancialYearId,
  loadSelectedFinancialYearId,
  saveSelectedFinancialYearId,
} from '@/lib/storage';
import type { FinancialYearContextState, FinancialYearOption } from '@/types/store/global/financialYearContext';
import { FINANCIAL_YEAR_CONTEXT_LOAD_STATUS } from '@/types/store/global/financialYearContext';

type SliceState = FinancialYearContextState;

const persistedId = loadSelectedFinancialYearId();

const initialState: SliceState = {
  status: FINANCIAL_YEAR_CONTEXT_LOAD_STATUS.idle,
  options: [],
  selectedFinancialYearId: persistedId,
  selectedCode: null,
  selectedName: null,
  error: null,
};

const financialYearContextSlice = createSlice({
  name: 'financialYearContext',
  initialState,
  reducers: {
    setFinancialYearOptionsLoading(state) {
      state.status = FINANCIAL_YEAR_CONTEXT_LOAD_STATUS.loading;
      state.error = null;
    },
    setFinancialYearOptions(
      state,
      action: PayloadAction<{ options: FinancialYearOption[]; preferredId?: number | null }>,
    ) {
      const { options, preferredId } = action.payload;
      state.status = FINANCIAL_YEAR_CONTEXT_LOAD_STATUS.succeeded;
      state.options = options;
      state.error = null;

      const resolvedId = resolveInitialFinancialYearId(
        options,
        preferredId ?? state.selectedFinancialYearId,
      );

      if (resolvedId == null) {
        state.selectedFinancialYearId = null;
        state.selectedCode = null;
        state.selectedName = null;
        clearSelectedFinancialYearId();
        return;
      }

      const selected = options.find((option) => option.financialYearId === resolvedId);
      state.selectedFinancialYearId = resolvedId;
      state.selectedCode = selected?.code ?? null;
      state.selectedName = selected?.name ?? null;
      saveSelectedFinancialYearId(resolvedId);
    },
    setFinancialYearOptionsFailed(state, action: PayloadAction<string>) {
      state.status = FINANCIAL_YEAR_CONTEXT_LOAD_STATUS.failed;
      state.error = action.payload;
    },
    setSelectedFinancialYear(state, action: PayloadAction<FinancialYearOption>) {
      state.selectedFinancialYearId = action.payload.financialYearId;
      state.selectedCode = action.payload.code;
      state.selectedName = action.payload.name;
      saveSelectedFinancialYearId(action.payload.financialYearId);
    },
    clearSelectedFinancialYear(state) {
      state.selectedFinancialYearId = null;
      state.selectedCode = null;
      state.selectedName = null;
      clearSelectedFinancialYearId();
    },
  },
});

export const financialYearContextActions = financialYearContextSlice.actions;
export const financialYearContextReducer = financialYearContextSlice.reducer;

export const selectFinancialYearContextStatus = (state: RootState) =>
  state.financialYearContext?.status ?? FINANCIAL_YEAR_CONTEXT_LOAD_STATUS.idle;

export const selectFinancialYearOptions = (state: RootState) =>
  state.financialYearContext?.options ?? [];

export const selectSelectedFinancialYearId = (state: RootState) =>
  state.financialYearContext?.selectedFinancialYearId ?? null;

export const selectSelectedFinancialYear = (state: RootState) => {
  const context = state.financialYearContext;
  if (!context?.selectedFinancialYearId) {
    return null;
  }

  return {
    financialYearId: context.selectedFinancialYearId,
    code: context.selectedCode,
    name: context.selectedName,
  };
};

export type { FinancialYearContextState };

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { clearAuth } from '@/store/global/authSlice';
import type { BillFormValues } from '@/types/billForm';
import {
  createInitialBillFormDraftState,
  createInitialBillNavigationState,
  type BillFormCreateDraft,
  type BillNavigationState,
} from '@/types/store/global/billFormDraft';
import type { RootState } from '@/types/store/root';

const initialState = createInitialBillFormDraftState();

type SetBillNavigationPayload = {
  financialYearId: number;
  lastBillId?: number | null;
  lastBillNumber?: string | null;
  nextBillNumber?: string | null;
};

const billFormDraftSlice = createSlice({
  name: 'billFormDraft',
  initialState,
  reducers: {
    setCreateDraft(state, action: PayloadAction<BillFormCreateDraft>) {
      state.create = action.payload;
    },
    clearCreateDraft(state) {
      state.create = null;
    },
    setEditDraft(state, action: PayloadAction<{ billId: number; values: BillFormValues }>) {
      state.editByBillId[action.payload.billId] = action.payload.values;
    },
    clearEditDraft(state, action: PayloadAction<{ billId: number }>) {
      delete state.editByBillId[action.payload.billId];
    },
    setBillNavigation(state, action: PayloadAction<SetBillNavigationPayload>) {
      const { financialYearId, ...patch } = action.payload;
      const current =
        state.navigationByFinancialYear[financialYearId] ?? createInitialBillNavigationState();

      state.navigationByFinancialYear[financialYearId] = {
        ...current,
        ...patch,
      };
    },
    clearAllBillFormDrafts: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(clearAuth, () => initialState);
  },
});

export const billFormDraftActions = billFormDraftSlice.actions;
export const billFormDraftReducer = billFormDraftSlice.reducer;

export const selectBillFormCreateDraft = (state: RootState) =>
  state.billFormDraft?.create ?? null;

export const selectBillFormEditDraft = (state: RootState, billId: number) =>
  state.billFormDraft?.editByBillId[billId] ?? null;

export const selectBillNavigation = (
  state: RootState,
  financialYearId: number | null,
): BillNavigationState | null => {
  if (financialYearId == null) {
    return null;
  }

  return state.billFormDraft?.navigationByFinancialYear[financialYearId] ?? null;
};

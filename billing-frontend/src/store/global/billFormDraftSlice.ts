import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { clearAuth } from '@/store/global/authSlice';
import type { BillFormValues } from '@/types/billForm';
import {
  createInitialBillFormDraftState,
  type BillFormCreateDraft,
  type BillFormDraftState,
} from '@/types/store/global/billFormDraft';
import type { RootState } from '@/types/store/root';

const initialState = createInitialBillFormDraftState();

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

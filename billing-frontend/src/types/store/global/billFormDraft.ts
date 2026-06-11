import type { BillFormValues } from '@/types/billForm';

export type BillFormCreateDraft = {
  financialYearId: number;
  values: BillFormValues;
};

export type BillNavigationState = {
  lastBillId: number | null;
  lastBillNumber: string | null;
  nextBillNumber: string | null;
};

export type BillFormDraftState = {
  create: BillFormCreateDraft | null;
  editByBillId: Record<number, BillFormValues>;
  navigationByFinancialYear: Record<number, BillNavigationState>;
};

export function createInitialBillNavigationState(): BillNavigationState {
  return {
    lastBillId: null,
    lastBillNumber: null,
    nextBillNumber: null,
  };
}

export function createInitialBillFormDraftState(): BillFormDraftState {
  return {
    create: null,
    editByBillId: {},
    navigationByFinancialYear: {},
  };
}

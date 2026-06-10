import type { BillFormValues } from '@/types/billForm';

export type BillFormCreateDraft = {
  financialYearId: number;
  values: BillFormValues;
};

export type BillFormDraftState = {
  create: BillFormCreateDraft | null;
  editByBillId: Record<number, BillFormValues>;
};

export function createInitialBillFormDraftState(): BillFormDraftState {
  return {
    create: null,
    editByBillId: {},
  };
}

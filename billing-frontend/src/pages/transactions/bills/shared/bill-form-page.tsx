import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BillForm } from '@/components/transactions/bill/bill-form';
import { BillFormToolbar } from '@/components/transactions/bill/bill-form-toolbar';
import { BillPreviewSheet } from '@/components/transactions/bill/bill-preview-sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes';
import { queryKeys } from '@/constants/queryKeys';
import { useBillFormLookups } from '@/hooks/useBillFormLookups';
import {
  createInitialBillFormValues,
  formatBillFormTruckNumber,
  mapBillDetailToFormValues,
  mapBillFormToPreview,
  mapBillFormToSaveRequest,
  recalculateBillForm,
  resolveBillFormDraftValues,
  validateBillFormFields,
  type BillFormFieldErrors,
} from '@/lib/billForm';
import { getNameBoardById } from '@/service/api/functions/nameBoards';
import { getTruckById } from '@/service/api/functions/trucks';
import { saveBillMutationOptions } from '@/service/mutation/bills';
import { billByIdQueryOptions, nextBillNumberQueryOptions } from '@/service/query/bills';
import {
  billFormDraftActions,
  selectBillFormCreateDraft,
  selectBillFormEditDraft,
} from '@/store/global/billFormDraftSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectSelectedFinancialYearId } from '@/store/global/financialYearContextSlice';
import type { BillFormValues } from '@/types/billForm';

type BillFormPageProps = {
  mode: 'create' | 'edit';
  billId?: number;
};

export function BillFormPage({ mode, billId }: BillFormPageProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const financialYearId = useAppSelector(selectSelectedFinancialYearId);
  const createDraft = useAppSelector(selectBillFormCreateDraft);
  const editDraft = useAppSelector((state) =>
    billId != null && billId > 0 ? selectBillFormEditDraft(state, billId) : null,
  );
  const lookups = useBillFormLookups();

  const restoredEditDraft = mode === 'edit' && billId != null && billId > 0 && editDraft != null;

  const [values, setValues] = useState<BillFormValues>(() =>
    resolveBillFormDraftValues({
      mode,
      billId,
      financialYearId,
      createDraft,
      editDraft,
    }) ?? createInitialBillFormValues(),
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<BillFormFieldErrors>({});
  const [hydrated, setHydrated] = useState(mode === 'create' || restoredEditDraft);
  const [previewOpen, setPreviewOpen] = useState(false);
  const previousFinancialYearIdRef = useRef(financialYearId);

  const nextNumberQuery = useQuery({
    ...nextBillNumberQueryOptions(financialYearId),
    enabled: mode === 'create' && financialYearId != null,
  });

  const billQuery = useQuery({
    ...billByIdQueryOptions(billId ?? 0),
    enabled: mode === 'edit' && billId != null && billId > 0,
  });

  const persistDraft = useCallback(
    (next: BillFormValues) => {
      if (mode === 'create' && financialYearId != null) {
        dispatch(
          billFormDraftActions.setCreateDraft({
            financialYearId,
            values: next,
          }),
        );
        return;
      }

      if (mode === 'edit' && billId != null && billId > 0) {
        dispatch(billFormDraftActions.setEditDraft({ billId, values: next }));
      }
    },
    [billId, dispatch, financialYearId, mode],
  );

  const applyTruckMeta = useCallback(
    async (truckId: number, apply: typeof setValues) => {
      try {
        const truck = await getTruckById(truckId);
        const nameBoard = await getNameBoardById(truck.nameBoardId);
        apply((current) => {
          const next = recalculateBillForm({
            ...current,
            truckId,
            truckNumber: formatBillFormTruckNumber(truck.truckNumber),
            nameBoardName: truck.nameBoardName ?? nameBoard.name,
            ownerName: nameBoard.ownerName,
            ownerMobile: nameBoard.ownerPhone ?? '',
          });
          persistDraft(next);
          return next;
        });
      } catch {
        // Preview can still show truck number from lookup label.
      }
    },
    [persistDraft],
  );

  const saveMutation = useMutation({
    ...saveBillMutationOptions,
    onSuccess: async (response) => {
      if (mode === 'create') {
        dispatch(billFormDraftActions.clearCreateDraft());
      } else if (billId != null && billId > 0) {
        dispatch(billFormDraftActions.clearEditDraft({ billId }));
      }

      await queryClient.invalidateQueries({ queryKey: queryKeys.bills.all });
      if (mode === 'create') {
        void navigate({
          to: ROUTES.billsEdit,
          params: { billId: String(response.bill.billId) },
        });
      }
    },
  });

  useEffect(() => {
    if (mode !== 'create') {
      return;
    }

    if (previousFinancialYearIdRef.current === financialYearId) {
      return;
    }

    previousFinancialYearIdRef.current = financialYearId;

    if (
      financialYearId != null &&
      createDraft?.financialYearId === financialYearId
    ) {
      setValues(recalculateBillForm(createDraft.values));
      setFieldErrors({});
      setFormError(null);
      return;
    }

    setValues(createInitialBillFormValues());
    setFieldErrors({});
    setFormError(null);
  }, [mode, financialYearId, createDraft]);

  useEffect(() => {
    if (mode !== 'create') {
      return;
    }

    if (!nextNumberQuery.data) {
      setValues((current) => {
        if (current.billNumber === '') {
          return current;
        }

        const next = recalculateBillForm({ ...current, billNumber: '' });
        persistDraft(next);
        return next;
      });
      return;
    }

    setValues((current) => {
      if (current.billNumber) {
        return current;
      }

      const next = recalculateBillForm({
        ...current,
        billNumber: nextNumberQuery.data.billNumber,
      });
      persistDraft(next);
      return next;
    });
  }, [mode, financialYearId, nextNumberQuery.data, persistDraft]);

  useEffect(() => {
    if (mode !== 'edit' || !billQuery.data || lookups.isLoading) {
      return;
    }

    if (restoredEditDraft) {
      setHydrated(true);
      return;
    }

    const next = mapBillDetailToFormValues(billQuery.data, {
      locations: lookups.locations,
      parties: lookups.parties,
      goods: lookups.goods,
      units: lookups.units,
      trucks: lookups.trucks,
    });
    setValues(next);
    persistDraft(next);
    setHydrated(true);
  }, [
    mode,
    billQuery.data,
    lookups.isLoading,
    lookups.locations,
    lookups.parties,
    lookups.goods,
    lookups.units,
    lookups.trucks,
    restoredEditDraft,
    persistDraft,
  ]);

  useEffect(() => {
    if (mode !== 'edit' || !billQuery.data?.bill.truckId || !hydrated) {
      return;
    }

    void applyTruckMeta(billQuery.data.bill.truckId, setValues);
  }, [mode, billQuery.data?.bill.truckId, hydrated, applyTruckMeta]);

  const handleTruckSelected = useCallback(
    (truckId: number) => {
      void applyTruckMeta(truckId, setValues);
    },
    [applyTruckMeta],
  );

  const handleFormChange = useCallback(
    (next: BillFormValues) => {
      const recalculated = recalculateBillForm(next);
      setValues(recalculated);
      persistDraft(recalculated);
      setFormError(null);
      setFieldErrors({});
    },
    [persistDraft],
  );

  const previewData = useMemo(() => mapBillFormToPreview(values), [values]);

  const handleSave = () => {
    const validation = validateBillFormFields(values);
    if (validation.formError) {
      setFieldErrors(validation.fieldErrors);
      setFormError(validation.formError);
      return;
    }

    setFieldErrors({});
    setFormError(null);
    saveMutation.mutate(mapBillFormToSaveRequest(values));
  };

  const handleCancelledChange = (isCancelled: boolean) => {
    handleFormChange({ ...values, isCancelled });
  };

  const isNextBillNumberLoading =
    mode === 'create' &&
    !values.billNumber &&
    (financialYearId == null || nextNumberQuery.isPending);

  const isPageLoading =
    lookups.isLoading ||
    isNextBillNumberLoading ||
    (mode === 'edit' && (billQuery.isLoading || !hydrated));

  const pageTitle = mode === 'create' ? 'Create Bill' : `Edit Bill${values.billNumber ? ` — ${values.billNumber}` : ''}`;

  const toolbarProps = {
    isCancelled: values.isCancelled,
    onCancelledChange: handleCancelledChange,
    onPreview: () => setPreviewOpen(true),
    onSave: handleSave,
    isSaving: saveMutation.isPending,
    isLoading: isPageLoading,
  };

  if (lookups.isError) {
    return (
      <p className="p-4 text-sm text-destructive">Failed to load form lookups. Refresh and try again.</p>
    );
  }

  if (mode === 'edit' && billQuery.isError) {
    return (
      <p className="p-4 text-sm text-destructive">
        {billQuery.error instanceof Error ? billQuery.error.message : 'Bill not found.'}
      </p>
    );
  }

  if (mode === 'create' && nextNumberQuery.isError) {
    return (
      <p className="p-4 text-sm text-destructive">
        {nextNumberQuery.error instanceof Error
          ? nextNumberQuery.error.message
          : 'Failed to load the next bill number for the selected financial year.'}
      </p>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden pb-24 sm:pb-6">
      <div className="mx-auto w-full max-w-6xl shrink-0">
        <h1 className="text-lg font-semibold tracking-tight sm:text-xl">{pageTitle}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate a new freight bill for dispatch. Fields marked with * are required unless the bill is cancelled.
        </p>
      </div>

      {formError ? (
        <p className="mx-auto w-full max-w-6xl shrink-0 text-sm text-destructive">{formError}</p>
      ) : null}
      {saveMutation.isError ? (
        <p className="mx-auto w-full max-w-6xl shrink-0 text-sm text-destructive">
          {saveMutation.error instanceof Error ? saveMutation.error.message : 'Save failed.'}
        </p>
      ) : null}

      <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col gap-4 overflow-hidden">
        <BillFormToolbar {...toolbarProps} className="hidden shrink-0 sm:flex" />

        <div className="min-h-0 flex-1 overflow-y-auto">
          {isPageLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>
          ) : (
            <BillForm
              values={values}
              fieldErrors={fieldErrors}
              locations={lookups.locations}
              trucks={lookups.trucks}
              parties={lookups.parties}
              goods={lookups.goods}
              units={lookups.units}
              onChange={handleFormChange}
              onTruckSelected={handleTruckSelected}
            />
          )}
        </div>
      </div>

      <BillPreviewSheet data={previewData} open={previewOpen} onOpenChange={setPreviewOpen} />

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 p-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.08)] backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:hidden">
        <div className="mx-auto w-full min-w-0 max-w-6xl px-1">
          <BillFormToolbar {...toolbarProps} />
        </div>
      </div>
    </div>
  );
}

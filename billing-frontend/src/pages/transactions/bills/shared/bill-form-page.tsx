import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BillForm } from '@/components/transactions/bill/bill-form';
import { BillFormActionBar } from '@/components/transactions/bill/bill-form-action-bar';
import { BillFormNavigator } from '@/components/transactions/bill/bill-form-navigator';
import { BillFormScreen } from '@/components/transactions/bill/bill-form-screen';
import { BillFormTopToolbar } from '@/components/transactions/bill/bill-form-top-toolbar';
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
import { findBillIdByNumber } from '@/lib/billNavigation';
import { incrementBillNumber } from '@/lib/billNumberNavigation';
import { getNameBoardById } from '@/service/api/functions/nameBoards';
import { getTruckById } from '@/service/api/functions/trucks';
import { saveBillMutationOptions } from '@/service/mutation/bills';
import { billByIdQueryOptions, nextBillNumberQueryOptions } from '@/service/query/bills';
import {
  billFormDraftActions,
  selectBillFormCreateDraft,
  selectBillFormEditDraft,
  selectBillNavigation,
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
  const billNavigation = useAppSelector((state) => selectBillNavigation(state, financialYearId));
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
  const [isNavigatingBill, setIsNavigatingBill] = useState(false);
  const [navigatorError, setNavigatorError] = useState<string | null>(null);
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
      if (financialYearId != null) {
        dispatch(
          billFormDraftActions.setBillNavigation({
            financialYearId,
            lastBillId: response.bill.billId,
            lastBillNumber: response.bill.billNumber,
            nextBillNumber: incrementBillNumber(response.bill.billNumber),
          }),
        );
      }

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
    if (mode !== 'create' || financialYearId == null || !nextNumberQuery.data) {
      return;
    }

    dispatch(
      billFormDraftActions.setBillNavigation({
        financialYearId,
        nextBillNumber: nextNumberQuery.data.billNumber,
      }),
    );
  }, [dispatch, financialYearId, mode, nextNumberQuery.data]);

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

  const handleNavigateBillNumber = useCallback(
    async (billNumber: string) => {
      setIsNavigatingBill(true);
      setNavigatorError(null);

      try {
        const targetBillId = await findBillIdByNumber(billNumber);
        if (targetBillId == null) {
          setNavigatorError(`Bill ${billNumber} was not found.`);
          return;
        }

        if (targetBillId === billId) {
          return;
        }

        await navigate({
          to: ROUTES.billsEdit,
          params: { billId: String(targetBillId) },
        });
      } catch {
        setNavigatorError('Could not open that bill. Try again.');
      } finally {
        setIsNavigatingBill(false);
      }
    },
    [billId, navigate],
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

  const maxBillNumber = billNavigation?.lastBillNumber ?? values.billNumber;

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
    <>
      <BillFormScreen
        formError={formError}
        saveError={
          saveMutation.isError
            ? saveMutation.error instanceof Error
              ? saveMutation.error.message
              : 'Save failed.'
            : null
        }
        topToolbar={
          <BillFormTopToolbar
            mode={mode}
            isLoading={isPageLoading}
            onPreview={() => setPreviewOpen(true)}
            navigator={
              maxBillNumber.trim() ? (
                <div className="min-w-0 flex-1">
                  <BillFormNavigator
                    billNumber={values.billNumber}
                    maxBillNumber={maxBillNumber}
                    disabled={isPageLoading}
                    isNavigating={isNavigatingBill}
                    onNavigate={handleNavigateBillNumber}
                  />
                  {navigatorError ? (
                    <p className="mt-1 text-xs text-destructive">{navigatorError}</p>
                  ) : null}
                </div>
              ) : null
            }
          />
        }
        actionBar={
          <BillFormActionBar
            isCancelled={values.isCancelled}
            onCancelledChange={handleCancelledChange}
            onSave={handleSave}
            isSaving={saveMutation.isPending}
            isLoading={isPageLoading}
          />
        }
      >
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
      </BillFormScreen>

      <BillPreviewSheet data={previewData} open={previewOpen} onOpenChange={setPreviewOpen} />
    </>
  );
}

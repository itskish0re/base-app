import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  validateBillFormFields,
  type BillFormFieldErrors,
} from '@/lib/billForm';
import { getNameBoardById } from '@/service/api/functions/nameBoards';
import { getTruckById } from '@/service/api/functions/trucks';
import { saveBillMutationOptions } from '@/service/mutation/bills';
import { billByIdQueryOptions, nextBillNumberQueryOptions } from '@/service/query/bills';
import type { BillFormValues } from '@/types/billForm';

type BillFormPageProps = {
  mode: 'create' | 'edit';
  billId?: number;
};

export function BillFormPage({ mode, billId }: BillFormPageProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const lookups = useBillFormLookups();

  const [values, setValues] = useState<BillFormValues>(() => createInitialBillFormValues());
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<BillFormFieldErrors>({});
  const [hydrated, setHydrated] = useState(mode === 'create');
  const [previewOpen, setPreviewOpen] = useState(false);

  const nextNumberQuery = useQuery({
    ...nextBillNumberQueryOptions(),
    enabled: mode === 'create',
  });

  const billQuery = useQuery({
    ...billByIdQueryOptions(billId ?? 0),
    enabled: mode === 'edit' && billId != null && billId > 0,
  });

  const applyTruckMeta = useCallback(async (truckId: number, apply: typeof setValues) => {
    try {
      const truck = await getTruckById(truckId);
      const nameBoard = await getNameBoardById(truck.nameBoardId);
      apply((current) =>
        recalculateBillForm({
          ...current,
          truckId,
          truckNumber: formatBillFormTruckNumber(truck.truckNumber),
          nameBoardName: truck.nameBoardName ?? nameBoard.name,
          ownerName: nameBoard.ownerName,
          ownerMobile: nameBoard.ownerPhone ?? '',
        }),
      );
    } catch {
      // Preview can still show truck number from lookup label.
    }
  }, []);

  const saveMutation = useMutation({
    ...saveBillMutationOptions,
    onSuccess: async (response) => {
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
    if (mode !== 'create' || !nextNumberQuery.data) {
      return;
    }

    setValues((current) =>
      current.billNumber
        ? current
        : recalculateBillForm({ ...current, billNumber: nextNumberQuery.data.billNumber }),
    );
  }, [mode, nextNumberQuery.data]);

  useEffect(() => {
    if (mode !== 'edit' || !billQuery.data || lookups.isLoading) {
      return;
    }

    setValues(
      mapBillDetailToFormValues(billQuery.data, {
        locations: lookups.locations,
        parties: lookups.parties,
        goods: lookups.goods,
        units: lookups.units,
        trucks: lookups.trucks,
      }),
    );
    setHydrated(true);
  }, [mode, billQuery.data, lookups.isLoading, lookups.locations, lookups.parties, lookups.goods, lookups.units, lookups.trucks]);

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

  const handleFormChange = useCallback((next: BillFormValues) => {
    setValues(recalculateBillForm(next));
    setFormError(null);
    setFieldErrors({});
  }, []);

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

  const isPageLoading =
    lookups.isLoading ||
    (mode === 'create' && nextNumberQuery.isLoading) ||
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

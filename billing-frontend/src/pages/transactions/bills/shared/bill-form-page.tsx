import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Eye, Save } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BillForm } from '@/components/transactions/bill/bill-form';
import { BillPreviewSheet } from '@/components/transactions/bill/bill-preview-sheet';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes';
import { queryKeys } from '@/constants/queryKeys';
import { useBillFormLookups } from '@/hooks/useBillFormLookups';
import {
  createInitialBillFormValues,
  mapBillDetailToFormValues,
  mapBillFormToPreview,
  mapBillFormToSaveRequest,
  recalculateBillForm,
  validateBillForm,
} from '@/lib/billForm';
import { getNameBoardById } from '@/service/api/functions/nameBoards';
import { getTruckById } from '@/service/api/functions/trucks';
import { saveBillMutationOptions } from '@/service/mutation/bills';
import { billByIdQueryOptions, nextBillNumberQueryOptions } from '@/service/query/bills';
import type { BillFormValues } from '@/types/billForm';
import { cn } from '@/lib/utils';

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
          truckNumber: truck.truckNumber,
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
  }, []);

  const previewData = useMemo(() => mapBillFormToPreview(values), [values]);

  const handleSave = () => {
    const validationError = validateBillForm(values);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    saveMutation.mutate(mapBillFormToSaveRequest(values));
  };

  const isPageLoading =
    lookups.isLoading ||
    (mode === 'create' && nextNumberQuery.isLoading) ||
    (mode === 'edit' && (billQuery.isLoading || !hydrated));

  const pageTitle = mode === 'create' ? 'Create Bill' : `Edit Bill${values.billNumber ? ` — ${values.billNumber}` : ''}`;

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

  const actionButtons = (
    <>
      <Button
        type="button"
        variant="outline"
        className="h-9 flex-1 sm:flex-none"
        onClick={() => setPreviewOpen(true)}
        disabled={isPageLoading}
      >
        <Eye className="size-4" />
        Preview
      </Button>
      <Button
        type="button"
        variant="outline"
        className="h-9 flex-1 sm:flex-none"
        onClick={() => void navigate({ to: ROUTES.bills })}
        disabled={saveMutation.isPending}
      >
        Cancel
      </Button>
      <Button
        type="button"
        className="h-9 flex-1 sm:flex-[1.5] sm:flex-none"
        onClick={handleSave}
        disabled={saveMutation.isPending || isPageLoading}
      >
        <Save className="size-4" />
        {saveMutation.isPending ? 'Saving…' : 'Save Bill'}
      </Button>
    </>
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 pb-24 sm:pb-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold tracking-tight sm:text-xl">{pageTitle}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate a new freight bill for dispatch. Fields marked with * are required.
          </p>
        </div>
        <div className="hidden shrink-0 gap-2 sm:flex">{actionButtons}</div>
      </div>

      {formError ? (
        <p className="mx-auto w-full max-w-6xl text-sm text-destructive">{formError}</p>
      ) : null}
      {saveMutation.isError ? (
        <p className="mx-auto w-full max-w-6xl text-sm text-destructive">
          {saveMutation.error instanceof Error ? saveMutation.error.message : 'Save failed.'}
        </p>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isPageLoading ? (
          <div className="mx-auto max-w-6xl space-y-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        ) : (
          <BillForm
            values={values}
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

      <BillPreviewSheet data={previewData} open={previewOpen} onOpenChange={setPreviewOpen} />

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 p-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.08)] backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:hidden">
        <div className="mx-auto flex max-w-lg gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-11 flex-1"
            onClick={() => void navigate({ to: ROUTES.bills })}
            disabled={saveMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="secondary"
            className={cn('h-11 flex-1 bg-secondary/80')}
            onClick={() => setPreviewOpen(true)}
            disabled={isPageLoading}
          >
            <Eye className="size-4" />
            Preview
          </Button>
          <Button
            type="button"
            className="h-11 flex-[1.5]"
            onClick={handleSave}
            disabled={saveMutation.isPending || isPageLoading}
          >
            <Save className="size-4" />
            {saveMutation.isPending ? 'Saving…' : 'Save Bill'}
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BillForm } from '@/components/transactions/bill/bill-form';
import { BillPreviewCanvas } from '@/components/transactions/bill/bill-preview-canvas';
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

  const pageTitle = mode === 'create' ? 'Create bill' : `Edit bill${values.billNumber ? ` — ${values.billNumber}` : ''}`;

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
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">{pageTitle}</h1>
          <p className="text-sm text-muted-foreground">
            Enter bill details on the left; the memo preview updates on the right.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => void navigate({ to: ROUTES.bills })}
            disabled={saveMutation.isPending}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={saveMutation.isPending || isPageLoading}>
            {saveMutation.isPending ? 'Saving…' : 'Save bill'}
          </Button>
        </div>
      </div>

      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
      {saveMutation.isError ? (
        <p className="text-sm text-destructive">
          {saveMutation.error instanceof Error ? saveMutation.error.message : 'Save failed.'}
        </p>
      ) : null}

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-2">
        <div className="min-h-0 overflow-y-auto rounded-lg border bg-background p-4">
          {isPageLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <BillForm
              values={values}
              locations={lookups.locations}
              trucks={lookups.trucks}
              parties={lookups.parties}
              goods={lookups.goods}
              units={lookups.units}
              billNumberReadOnly={mode === 'edit'}
              onChange={handleFormChange}
              onTruckSelected={handleTruckSelected}
            />
          )}
        </div>

        <div className="min-h-0">
          {isPageLoading ? (
            <Skeleton className="h-full min-h-[24rem] w-full rounded-lg" />
          ) : (
            <BillPreviewCanvas data={previewData} className="h-full" />
          )}
        </div>
      </div>
    </div>
  );
}

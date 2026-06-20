import { BillExpandedFormView } from '@/components/transactions/bill/bill-expanded-form-view';
import type { DataTableExpandedRowContext } from '@/components/derived/data-table/dt-types';
import { useBillFormLookups } from '@/hooks/useBillFormLookups';
import {
  mapBillDetailToFormValues,
  mapBillListRowToFormValues,
} from '@/lib/billForm';
import type { BillDetailResponse, BillListRowDto } from '@/types/entity/bill';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

type BillExpandedRowProps = {
  context: DataTableExpandedRowContext<BillListRowDto, BillDetailResponse>;
};

export function BillExpandedRow({ context }: BillExpandedRowProps) {
  const { row, detail, isLoading, isError, error } = context;
  const lookups = useBillFormLookups();

  const values = useMemo(() => {
    if (detail && !lookups.isLoading) {
      const fromDetail = mapBillDetailToFormValues(detail, lookups);
      const fromList = mapBillListRowToFormValues(row);

      return {
        ...fromDetail,
        fromLocationName: fromList.fromLocationName || fromDetail.fromLocationName,
        truckNumber: fromList.truckNumber || fromDetail.truckNumber,
        nameBoardName: fromList.nameBoardName || fromDetail.nameBoardName,
        ownerName: fromList.ownerName || fromDetail.ownerName,
        ownerMobile: fromList.ownerMobile || fromDetail.ownerMobile,
      };
    }

    return mapBillListRowToFormValues(row);
  }, [detail, row, lookups]);

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        {error instanceof Error ? error.message : 'Failed to load bill details.'}
      </p>
    );
  }

  if (detail && lookups.isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 py-1">
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <BillExpandedFormView
      values={values}
      loadsLoading={isLoading && !detail}
    />
  );
}

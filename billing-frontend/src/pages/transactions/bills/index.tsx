import { useCallback, useMemo } from 'react';
import {
  DataTable,
  getPrimaryEntityColumns,
  mapScreenColumnsToDataTableColumns,
} from '@/components/derived/data-table';
import { ScreenDataTableSkeleton } from '@/components/derived/screen-page';
import { SCREEN_KEYS } from '@/constants/screenKeys';
import { useScreenMetadata } from '@/hooks/useScreenMetadata';
import { useScreenSlice, useScreenTableSelector } from '@/hooks/useScreenSlice';
import { listBillsQueryOptions } from '@/service/query/bills';
import { useAppDispatch } from '@/store/hooks';
import { billsScreenActions } from '@/store/screens/billsSlice';
import type { BillListRowDto } from '@/types/entity/bill';
import { SCREEN_METADATA_LOAD_STATUS } from '@/types/store/screen';

export function BillsPage() {
  useScreenSlice(SCREEN_KEYS.bills);

  const dispatch = useAppDispatch();
  const table = useScreenTableSelector(SCREEN_KEYS.bills);
  const { metadata, isLoading } = useScreenMetadata(SCREEN_KEYS.bills);

  const onTableChange = useCallback(
    (next: typeof table) => {
      dispatch(billsScreenActions.setTable(next));
    },
    [dispatch],
  );

  const columns = useMemo(
    () => mapScreenColumnsToDataTableColumns(getPrimaryEntityColumns(metadata.entities)),
    [metadata.entities],
  );

  const metadataReady = metadata.status === SCREEN_METADATA_LOAD_STATUS.succeeded;

  if (metadata.status === SCREEN_METADATA_LOAD_STATUS.failed) {
    return (
      <p className="text-sm text-destructive">{metadata.error ?? 'Failed to load screen.'}</p>
    );
  }

  if (isLoading) {
    return <ScreenDataTableSkeleton title="Bills" />;
  }

  return (
    <DataTable<BillListRowDto>
      title="Bills"
      value={table}
      onChange={onTableChange}
      queryOptions={listBillsQueryOptions}
      enabled={metadataReady}
      financialYearScoped
      columns={columns}
      rowId={(row) => row.billId}
      searchPlaceholder="Search bills…"
    />
  );
}

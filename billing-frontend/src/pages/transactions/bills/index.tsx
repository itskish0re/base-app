import { useNavigate } from '@tanstack/react-router';
import { useCallback, useMemo } from 'react';
import {
  DataTable,
  getPrimaryEntityColumns,
  mapScreenColumnsToDataTableColumns,
  rowActionEdit,
  type DataTableExpandedRowContext,
} from '@/components/derived/data-table';
import { ScreenDataTableSkeleton } from '@/components/derived/screen-page';
import { BillExpandedRow } from '@/components/transactions/bill/bill-expanded-row';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { SCREEN_KEYS } from '@/constants/screenKeys';
import { useScreenMetadata } from '@/hooks/useScreenMetadata';
import { useScreenSlice, useScreenTableSelector } from '@/hooks/useScreenSlice';
import { billByIdQueryOptions, listBillsQueryOptions } from '@/service/query/bills';
import { useAppDispatch } from '@/store/hooks';
import { billsScreenActions } from '@/store/screens/billsSlice';
import type { BillDetailResponse, BillListRowDto } from '@/types/entity/bill';
import { SCREEN_METADATA_LOAD_STATUS } from '@/types/store/screen';

export function BillsPage() {
  useScreenSlice(SCREEN_KEYS.bills);
  const navigate = useNavigate();

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

  const rowExpansion = useMemo(
    () => ({
      detailQueryOptions: billByIdQueryOptions,
      renderContent: (context: DataTableExpandedRowContext<BillListRowDto, BillDetailResponse>) => (
        <BillExpandedRow context={context} />
      ),
    }),
    [],
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
    <div className="flex min-h-0 flex-1 flex-col">
    <DataTable<BillListRowDto, BillDetailResponse>
      title="Bills"
      headerActions={
        <Button
          type="button"
          size="sm"
          onClick={() => void navigate({ to: ROUTES.billsCreate })}
        >
          New bill
        </Button>
      }
      value={table}
      onChange={onTableChange}
      queryOptions={listBillsQueryOptions}
      enabled={metadataReady}
      financialYearScoped
      columns={columns}
      rowId={(row) => row.billId}
      rowExpansion={rowExpansion}
      searchPlaceholder="Search bills…"
      renderRowActions={({ row, rowId }) => [
        rowActionEdit({
          row,
          onClick: () =>
            void navigate({
              to: ROUTES.billsEdit,
              params: { billId: String(rowId) },
            }),
        }),
      ]}
    />
    </div>
  );
}

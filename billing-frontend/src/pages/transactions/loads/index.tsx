import { useCallback, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  DataTable,
  getPrimaryEntityColumns,
  mapScreenColumnsToDataTableColumns,
  rowActionCustom,
} from '@/components/derived/data-table';
import { ScreenDataTableSkeleton } from '@/components/derived/screen-page';
import { SCREEN_KEYS } from '@/constants/screenKeys';
import { useScreenMetadata } from '@/hooks/useScreenMetadata';
import { useScreenSlice, useScreenTableSelector } from '@/hooks/useScreenSlice';
import { listLoadsQueryOptions } from '@/service/query/loads';
import { useAppDispatch } from '@/store/hooks';
import { loadsScreenActions } from '@/store/screens/loadsSlice';
import type { LoadListRowDto } from '@/types/entity/load';
import { SCREEN_METADATA_LOAD_STATUS } from '@/types/store/screen';

export function LoadsPage() {
  useScreenSlice(SCREEN_KEYS.loads);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const table = useScreenTableSelector(SCREEN_KEYS.loads);
  const { metadata, isLoading } = useScreenMetadata(SCREEN_KEYS.loads);

  const onTableChange = useCallback(
    (next: typeof table) => {
      dispatch(loadsScreenActions.setTable(next));
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
    return <ScreenDataTableSkeleton title="Loads" />;
  }

  return (
    <DataTable<LoadListRowDto>
      title="Loads"
      value={table}
      onChange={onTableChange}
      queryOptions={listLoadsQueryOptions}
      enabled={metadataReady}
      financialYearScoped
      columns={columns}
      rowId={(row) => row.loadId}
      searchPlaceholder="Search loads…"
      renderRowActions={({ row }) => [
        rowActionCustom({
          label: 'Open bill',
          onClick: () => {
            void navigate({
              to: '/transactions/bills/$billId/edit',
              params: { billId: String(row.billId) },
            });
          },
        }),
      ]}
    />
  );
}

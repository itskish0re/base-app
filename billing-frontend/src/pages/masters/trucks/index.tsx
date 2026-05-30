import { useCallback, useMemo } from 'react';
import {
  DataTable,
  getPrimaryEntityColumns,
  mapScreenColumnsToDataTableColumns,
  rowActionDelete,
  rowActionToggle,
  type DataTableColumnDef,
} from '@/components/derived/data-table';
import { SCREEN_KEYS } from '@/constants/screenKeys';
import { useScreenMetadata } from '@/hooks/useScreenMetadata';
import { useScreenSlice, useScreenTableSelector } from '@/hooks/useScreenSlice';
import { listTrucksQueryOptions } from '@/service/query/trucks';
import {
  deleteTrucksMutationOptions,
  toggleTrucksMutationOptions,
} from '@/service/mutation/trucks';
import { useAppDispatch } from '@/store/hooks';
import { trucksScreenActions } from '@/store/screens/trucksSlice';
import type { EntityScreenMetadataDto } from '@/types/entity/screen';
import type { TruckDto } from '@/types/entity';
import { SCREEN_METADATA_LOAD_STATUS } from '@/types/store/screen';

function mapTruckScreenColumnsToDataTableColumns(
  entities: EntityScreenMetadataDto[],
): DataTableColumnDef[] {
  return mapScreenColumnsToDataTableColumns(getPrimaryEntityColumns(entities)).map((column) =>
    column.fieldName === 'nameBoardId'
      ? { ...column, fieldName: 'nameBoardName' }
      : column,
  );
}

export function TrucksPage() {
  useScreenSlice(SCREEN_KEYS.truck);

  const dispatch = useAppDispatch();
  const table = useScreenTableSelector(SCREEN_KEYS.truck);
  const { metadata } = useScreenMetadata(SCREEN_KEYS.truck);

  const onTableChange = useCallback(
    (next: typeof table) => {
      dispatch(trucksScreenActions.setTable(next));
    },
    [dispatch],
  );

  const columns = useMemo(
    () => mapTruckScreenColumnsToDataTableColumns(metadata.entities),
    [metadata.entities],
  );

  const metadataReady = metadata.status === SCREEN_METADATA_LOAD_STATUS.succeeded;

  if (metadata.status === SCREEN_METADATA_LOAD_STATUS.failed) {
    return (
      <p className="text-sm text-destructive">{metadata.error ?? 'Failed to load screen.'}</p>
    );
  }

  if (!metadataReady) {
    return <p className="text-sm text-muted-foreground">Loading screen…</p>;
  }

  return (
    <DataTable<TruckDto>
      title="Trucks"
      value={table}
      onChange={onTableChange}
      queryOptions={listTrucksQueryOptions}
      enabled={metadataReady}
      mutations={{
        delete: () => deleteTrucksMutationOptions,
        toggle: () => toggleTrucksMutationOptions,
      }}
      columns={columns}
      rowId={(row) => row.truckId}
      searchPlaceholder="Search trucks…"
      renderRowActions={({ row, rowId, mutations }) => [
        rowActionToggle({
          checked: row.isEnabled,
          disabled: mutations.toggle?.isPending,
          onCheckedChange: (checked) =>
            mutations.toggle?.mutate({
              items: [{ truckId: rowId, isEnabled: checked }],
            }),
        }),
        rowActionDelete({
          row,
          disabled: mutations.delete?.isPending,
          onClick: () => mutations.delete?.mutate({ ids: [rowId] }),
        }),
      ]}
    />
  );
}

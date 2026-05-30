import { useCallback, useMemo } from 'react';
import {
  DataTable,
  getPrimaryEntityColumns,
  mapScreenColumnsToDataTableColumns,
  rowActionDelete,
  rowActionEdit,
  rowActionToggle,
  type DataTableColumnDef,
} from '@/components/derived/data-table';
import { ScreenDataTableSkeleton } from '@/components/derived/screen-page';
import { useEntityFormShell } from '@/components/derived/form-shell';
import { TruckFormShell } from '@/pages/masters/trucks/truck-form-shell';
import { Button } from '@/components/ui/button';
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
  const { metadata, isLoading } = useScreenMetadata(SCREEN_KEYS.truck);
  const formShell = useEntityFormShell<number>();

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

  if (isLoading) {
    return <ScreenDataTableSkeleton title="Trucks" />;
  }

  return (
    <>
      <DataTable<TruckDto>
        title="Trucks"
        headerActions={
          <Button type="button" size="sm" onClick={formShell.openCreate}>
            Create
          </Button>
        }
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
          rowActionEdit({
            row,
            onClick: () => formShell.openEdit(rowId),
          }),
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
      <TruckFormShell
        shell={formShell}
        entities={metadata.entities}
        presentation="dialog"
      />
    </>
  );
}

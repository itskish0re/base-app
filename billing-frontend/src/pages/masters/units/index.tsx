import { useCallback, useMemo } from 'react';
import {
  DataTable,
  getPrimaryEntityColumns,
  mapScreenColumnsToDataTableColumns,
  rowActionDelete,
  rowActionEdit,
  rowActionToggle,
} from '@/components/derived/data-table';
import { ScreenDataTableSkeleton } from '@/components/derived/screen-page';
import { useEntityFormShell } from '@/components/derived/form-shell';
import { UnitFormShell } from '@/pages/masters/units/unit-form-shell';
import { Button } from '@/components/ui/button';
import { SCREEN_KEYS } from '@/constants/screenKeys';
import { useScreenMetadata } from '@/hooks/useScreenMetadata';
import { useScreenSlice, useScreenTableSelector } from '@/hooks/useScreenSlice';
import { listUnitsQueryOptions } from '@/service/query/units';
import {
  deleteUnitsMutationOptions,
  toggleUnitsMutationOptions,
} from '@/service/mutation/units';
import { useAppDispatch } from '@/store/hooks';
import { unitsScreenActions } from '@/store/screens/unitsSlice';
import type { UnitDto } from '@/types/entity';
import { SCREEN_METADATA_LOAD_STATUS } from '@/types/store/screen';

export function UnitsPage() {
  useScreenSlice(SCREEN_KEYS.unit);

  const dispatch = useAppDispatch();
  const table = useScreenTableSelector(SCREEN_KEYS.unit);
  const { metadata, isLoading } = useScreenMetadata(SCREEN_KEYS.unit);
  const formShell = useEntityFormShell<number>();

  const onTableChange = useCallback(
    (next: typeof table) => {
      dispatch(unitsScreenActions.setTable(next));
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
    return <ScreenDataTableSkeleton title="Units" />;
  }

  return (
    <>
      <DataTable<UnitDto>
        title="Units"
        headerActions={
          <Button type="button" size="sm" onClick={formShell.openCreate}>
            Create
          </Button>
        }
        value={table}
        onChange={onTableChange}
        queryOptions={listUnitsQueryOptions}
        enabled={metadataReady}
        mutations={{
          delete: () => deleteUnitsMutationOptions,
          toggle: () => toggleUnitsMutationOptions,
        }}
        columns={columns}
        rowId={(row) => row.unitId}
        searchPlaceholder="Search unit…"
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
                items: [{ unitId: rowId, isEnabled: checked }],
              }),
          }),
          rowActionDelete({
            row,
            disabled: mutations.delete?.isPending,
            onClick: () => mutations.delete?.mutate({ ids: [rowId] }),
          }),
        ]}
      />
      <UnitFormShell
        shell={formShell}
        entities={metadata.entities}
        presentation="dialog"
      />
    </>
  );
}

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
import { LocationFormShell } from '@/pages/masters/locations/location-form-shell';
import { Button } from '@/components/ui/button';
import { SCREEN_KEYS } from '@/constants/screenKeys';
import { useScreenMetadata } from '@/hooks/useScreenMetadata';
import { useScreenSlice, useScreenTableSelector } from '@/hooks/useScreenSlice';
import { listLocationsQueryOptions } from '@/service/query/locations';
import {
  deleteLocationsMutationOptions,
  toggleLocationsMutationOptions,
} from '@/service/mutation/locations';
import { useAppDispatch } from '@/store/hooks';
import { locationsScreenActions } from '@/store/screens/locationsSlice';
import type { LocationDto } from '@/types/entity';
import { SCREEN_METADATA_LOAD_STATUS } from '@/types/store/screen';

export function LocationsPage() {
  useScreenSlice(SCREEN_KEYS.location);

  const dispatch = useAppDispatch();
  const table = useScreenTableSelector(SCREEN_KEYS.location);
  const { metadata, isLoading } = useScreenMetadata(SCREEN_KEYS.location);
  const formShell = useEntityFormShell<number>();

  const onTableChange = useCallback(
    (next: typeof table) => {
      dispatch(locationsScreenActions.setTable(next));
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
    return <ScreenDataTableSkeleton title="Locations" />;
  }

  return (
    <>
      <DataTable<LocationDto>
        title="Locations"
        headerActions={
          <Button type="button" size="sm" onClick={formShell.openCreate}>
            Create
          </Button>
        }
        value={table}
        onChange={onTableChange}
        queryOptions={listLocationsQueryOptions}
        enabled={metadataReady}
        mutations={{
          delete: () => deleteLocationsMutationOptions,
          toggle: () => toggleLocationsMutationOptions,
        }}
        columns={columns}
        rowId={(row) => row.locationId}
        searchPlaceholder="Search location…"
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
                items: [{ locationId: rowId, isEnabled: checked }],
              }),
          }),
          rowActionDelete({
            row,
            disabled: mutations.delete?.isPending,
            onClick: () => mutations.delete?.mutate({ ids: [rowId] }),
          }),
        ]}
      />
      <LocationFormShell
        shell={formShell}
        entities={metadata.entities}
        presentation="dialog"
      />
    </>
  );
}

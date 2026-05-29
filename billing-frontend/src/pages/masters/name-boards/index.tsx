import { useCallback, useMemo } from 'react';
import { DataTable, getPrimaryEntityColumns, mapScreenColumnsToDataTableColumns } from '@/components/derived/data-table';
import { Button } from '@/components/ui/button';
import { SCREEN_KEYS } from '@/constants/screenKeys';
import { useScreenMetadata } from '@/hooks/useScreenMetadata';
import { useScreenSlice, useScreenTableSelector } from '@/hooks/useScreenSlice';
import { listNameBoardsQueryOptions } from '@/service/query/nameBoards';
import {
  createNameBoardsMutationOptions,
  deleteNameBoardsMutationOptions,
  toggleNameBoardsMutationOptions,
  updateNameBoardsMutationOptions,
} from '@/service/mutation/nameBoards';
import { useAppDispatch } from '@/store/hooks';
import { nameBoardsScreenActions } from '@/store/screens/nameBoardsSlice';
import type { NameBoardDto } from '@/types/entity';
import { SCREEN_METADATA_LOAD_STATUS } from '@/types/store/screen';

export function NameBoardsPage() {
  useScreenSlice(SCREEN_KEYS.nameBoard);

  const dispatch = useAppDispatch();
  const table = useScreenTableSelector(SCREEN_KEYS.nameBoard);
  const { metadata } = useScreenMetadata(SCREEN_KEYS.nameBoard);

  const onTableChange = useCallback(
    (next: typeof table) => {
      dispatch(nameBoardsScreenActions.setTable(next));
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

  if (!metadataReady) {
    return <p className="text-sm text-muted-foreground">Loading screen…</p>;
  }

  return (
    <DataTable<NameBoardDto>
      title="Name Board"
      headerActions={
        <Button type="button" size="sm">
          Add
        </Button>
      }
      value={table}
      onChange={onTableChange}
      queryOptions={listNameBoardsQueryOptions}
      enabled={metadataReady}
      mutations={{
        create: () => createNameBoardsMutationOptions,
        update: () => updateNameBoardsMutationOptions,
        delete: () => deleteNameBoardsMutationOptions,
        toggle: () => toggleNameBoardsMutationOptions,
      }}
      columns={columns}
      rowId={(row) => row.nameBoardId}
      searchPlaceholder="Search name boards…"
      renderActionsColumn={({ rowId, mutations }) => (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={mutations.delete?.isPending}
          onClick={() => mutations.delete?.mutate({ ids: [rowId] })}
        >
          Delete
        </Button>
      )}
    />
  );
}

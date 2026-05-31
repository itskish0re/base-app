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
import { GoodsFormShell } from '@/pages/masters/goods/goods-form-shell';
import { Button } from '@/components/ui/button';
import { SCREEN_KEYS } from '@/constants/screenKeys';
import { useScreenMetadata } from '@/hooks/useScreenMetadata';
import { useScreenSlice, useScreenTableSelector } from '@/hooks/useScreenSlice';
import { listGoodsQueryOptions } from '@/service/query/goods';
import {
  deleteGoodsMutationOptions,
  toggleGoodsMutationOptions,
} from '@/service/mutation/goods';
import { useAppDispatch } from '@/store/hooks';
import { goodsScreenActions } from '@/store/screens/goodsSlice';
import type { GoodsDto } from '@/types/entity';
import { SCREEN_METADATA_LOAD_STATUS } from '@/types/store/screen';

export function GoodssPage() {
  useScreenSlice(SCREEN_KEYS.goods);

  const dispatch = useAppDispatch();
  const table = useScreenTableSelector(SCREEN_KEYS.goods);
  const { metadata, isLoading } = useScreenMetadata(SCREEN_KEYS.goods);
  const formShell = useEntityFormShell<number>();

  const onTableChange = useCallback(
    (next: typeof table) => {
      dispatch(goodsScreenActions.setTable(next));
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
    return <ScreenDataTableSkeleton title="Goods" />;
  }

  return (
    <>
      <DataTable<GoodsDto>
        title="Goods"
        headerActions={
          <Button type="button" size="sm" onClick={formShell.openCreate}>
            Create
          </Button>
        }
        value={table}
        onChange={onTableChange}
        queryOptions={listGoodsQueryOptions}
        enabled={metadataReady}
        mutations={{
          delete: () => deleteGoodsMutationOptions,
          toggle: () => toggleGoodsMutationOptions,
        }}
        columns={columns}
        rowId={(row) => row.goodsId}
        searchPlaceholder="Search goods…"
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
                items: [{ goodsId: rowId, isEnabled: checked }],
              }),
          }),
          rowActionDelete({
            row,
            disabled: mutations.delete?.isPending,
            onClick: () => mutations.delete?.mutate({ ids: [rowId] }),
          }),
        ]}
      />
      <GoodsFormShell
        shell={formShell}
        entities={metadata.entities}
        presentation="dialog"
      />
    </>
  );
}

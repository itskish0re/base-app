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
import { FinancialYearFormShell } from '@/pages/masters/financial-years/financial-year-form-shell';
import { Button } from '@/components/ui/button';
import { SCREEN_KEYS } from '@/constants/screenKeys';
import { useScreenMetadata } from '@/hooks/useScreenMetadata';
import { useScreenSlice, useScreenTableSelector } from '@/hooks/useScreenSlice';
import { listFinancialYearsQueryOptions } from '@/service/query/financialYears';
import {
  deleteFinancialYearsMutationOptions,
  toggleFinancialYearsMutationOptions,
} from '@/service/mutation/financialYears';
import { useAppDispatch } from '@/store/hooks';
import { financialYearsScreenActions } from '@/store/screens/financialYearsSlice';
import type { FinancialYearDto } from '@/types/entity';
import { SCREEN_METADATA_LOAD_STATUS } from '@/types/store/screen';

export function FinancialYearsPage() {
  useScreenSlice(SCREEN_KEYS.financialYear);

  const dispatch = useAppDispatch();
  const table = useScreenTableSelector(SCREEN_KEYS.financialYear);
  const { metadata, isLoading } = useScreenMetadata(SCREEN_KEYS.financialYear);
  const formShell = useEntityFormShell<number>();

  const onTableChange = useCallback(
    (next: typeof table) => {
      dispatch(financialYearsScreenActions.setTable(next));
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
    return <ScreenDataTableSkeleton title="Financial Years" />;
  }

  return (
    <>
      <DataTable<FinancialYearDto>
        title="Financial Years"
        headerActions={
          <Button type="button" size="sm" onClick={formShell.openCreate}>
            Create
          </Button>
        }
        value={table}
        onChange={onTableChange}
        queryOptions={listFinancialYearsQueryOptions}
        enabled={metadataReady}
        mutations={{
          delete: () => deleteFinancialYearsMutationOptions,
          toggle: () => toggleFinancialYearsMutationOptions,
        }}
        columns={columns}
        rowId={(row) => row.financialYearId}
        searchPlaceholder="Search financial year…"
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
                items: [{ financialYearId: rowId, isEnabled: checked }],
              }),
          }),
          rowActionDelete({
            row,
            disabled: mutations.delete?.isPending,
            onClick: () => mutations.delete?.mutate({ ids: [rowId] }),
          }),
        ]}
      />
      <FinancialYearFormShell
        shell={formShell}
        entities={metadata.entities}
        presentation="dialog"
      />
    </>
  );
}

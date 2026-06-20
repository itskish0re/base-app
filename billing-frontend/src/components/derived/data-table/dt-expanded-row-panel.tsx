import { useQuery } from '@tanstack/react-query';
import { DataTableExpandedFields } from '@/components/derived/data-table/dt-expanded-fields';
import type {
  DataTableColumnDef,
  DataTableExpandedRowContext,
  DataTableRowExpansionConfig,
} from '@/components/derived/data-table/dt-types';
import { Skeleton } from '@/components/ui/skeleton';

type DataTableExpandedRowPanelProps<TRow extends object, TDetail> = {
  row: TRow;
  rowId: number;
  detailColumns: DataTableColumnDef[];
  rowExpansion: DataTableRowExpansionConfig<TRow, TDetail>;
};

function DataTableExpandedRowPanelStatic<TRow extends object, TDetail>({
  row,
  rowId,
  detailColumns,
  rowExpansion,
}: DataTableExpandedRowPanelProps<TRow, TDetail>) {
  const context: DataTableExpandedRowContext<TRow, TDetail> = {
    row,
    rowId,
    detail: undefined,
    isLoading: false,
    isError: false,
    error: null,
  };

  if (rowExpansion.renderContent) {
    return <>{rowExpansion.renderContent(context)}</>;
  }

  return <DataTableExpandedFields row={row} columns={detailColumns} />;
}

function DataTableExpandedRowPanelWithFetch<TRow extends object, TDetail>({
  row,
  rowId,
  detailColumns,
  rowExpansion,
}: DataTableExpandedRowPanelProps<TRow, TDetail>) {
  const detailQueryOptions = rowExpansion.detailQueryOptions!(rowId);
  const query = useQuery(detailQueryOptions);

  const context: DataTableExpandedRowContext<TRow, TDetail> = {
    row,
    rowId,
    detail: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };

  if (rowExpansion.renderContent) {
    return <>{rowExpansion.renderContent(context)}</>;
  }

  if (query.isLoading) {
    return (
      <div className="space-y-2 py-1">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-3/5" />
      </div>
    );
  }

  if (query.isError) {
    return (
      <p className="text-sm text-destructive">
        {query.error instanceof Error ? query.error.message : 'Failed to load details.'}
      </p>
    );
  }

  const dataSource = (query.data ?? row) as TRow;

  return <DataTableExpandedFields row={dataSource} columns={detailColumns} />;
}

export function DataTableExpandedRowPanel<TRow extends object, TDetail = TRow>(
  props: DataTableExpandedRowPanelProps<TRow, TDetail>,
) {
  if (props.rowExpansion.detailQueryOptions) {
    return <DataTableExpandedRowPanelWithFetch {...props} />;
  }

  return <DataTableExpandedRowPanelStatic {...props} />;
}

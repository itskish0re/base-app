import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { DtColumnFilters } from '@/components/derived/data-table/dt-column-filters';
import { DataTableProvider } from '@/components/derived/data-table/dt-provider';
import { DtErrors } from '@/components/derived/data-table/dt-errors';
import { DtHeader } from '@/components/derived/data-table/dt-header';
import { DtPagination } from '@/components/derived/data-table/dt-pagination';
import { DtToolbar } from '@/components/derived/data-table/dt-toolbar';
import {
  type DataTableActionsColumnDef,
  type DataTableColumnDef,
  type DataTableMutationsHandle,
  type DataTableProps,
  type DataTableSortState,
} from '@/components/derived/data-table/dt-types';
import {
  applyColumnFilters,
  formatDataTableCellValue,
  getVisibleDataTableColumns,
} from '@/components/derived/data-table/dt-utils';
import { useDataTable } from '@/components/derived/data-table/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

function cellAlignClass(align: DataTableColumnDef['align']): string {
  if (align === 'center') {
    return 'text-center';
  }

  if (align === 'right') {
    return 'text-right';
  }

  return 'text-left';
}

function SortIndicator({
  fieldName,
  sortable,
  sort,
}: {
  fieldName: string;
  sortable: boolean;
  sort: DataTableSortState | null;
}) {
  if (!sortable) {
    return null;
  }

  if (sort?.fieldName !== fieldName) {
    return <ArrowUpDown className="ml-1 inline size-3.5 opacity-40" />;
  }

  if (sort.direction === 'asc') {
    return <ArrowUp className="ml-1 inline size-3.5" />;
  }

  return <ArrowDown className="ml-1 inline size-3.5" />;
}

function buildTanStackColumns<TRow extends object>(
  columns: DataTableColumnDef[],
  actionsColumn: DataTableActionsColumnDef<TRow> | undefined,
  rowId: (row: TRow) => number,
  mutations: DataTableMutationsHandle,
): ColumnDef<TRow>[] {
  const dataColumns: ColumnDef<TRow>[] = columns.map((column) => ({
    id: column.id,
    accessorFn: (row) => row[column.fieldName as keyof TRow],
    header: column.header,
    cell: ({ row }) => formatDataTableCellValue(row.getValue(column.id)),
    meta: { columnDef: column },
  }));

  if (!actionsColumn) {
    return dataColumns;
  }

  return [
    ...dataColumns,
    {
      id: '_actions',
      header: actionsColumn.header ?? '',
      cell: ({ row }) =>
        actionsColumn.render({
          row: row.original,
          rowId: rowId(row.original),
          mutations,
        }),
      meta: { isActions: true },
    },
  ];
}

type DataTableViewProps<TRow extends object> = Pick<
  DataTableProps<TRow>,
  'columns' | 'rowId' | 'actionsColumn' | 'emptyMessage' | 'title' | 'headerActions' | 'searchPlaceholder'
>;

function DataTableView<TRow extends object>({
  columns,
  rowId,
  actionsColumn,
  emptyMessage = 'No results.',
  title,
  headerActions,
  searchPlaceholder,
}: DataTableViewProps<TRow>) {
  const {
    tableState,
    rows,
    isLoading,
    errorMessage,
    mutations,
    toggleSort,
    columnVisibility,
    showColumnSearch,
    columnFilters,
    setColumns,
  } = useDataTable<TRow>();

  useEffect(() => {
    setColumns(columns);
  }, [columns, setColumns]);

  const visibleColumns = useMemo(
    () => getVisibleDataTableColumns(columns, columnVisibility),
    [columns, columnVisibility],
  );

  const displayRows = useMemo(
    () => applyColumnFilters(rows, visibleColumns, columnFilters),
    [rows, visibleColumns, columnFilters],
  );

  const tanstackColumns = useMemo(
    () => buildTanStackColumns(visibleColumns, actionsColumn, rowId, mutations),
    [visibleColumns, actionsColumn, rowId, mutations],
  );

  const table = useReactTable({
    data: displayRows,
    columns: tanstackColumns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    getRowId: (row) => String(rowId(row)),
  });

  const errorMessages = errorMessage ? [errorMessage] : [];
  const hasActionsColumn = Boolean(actionsColumn);

  return (
    <div className="space-y-0">
      <DtHeader title={title} actions={headerActions} />
      {errorMessages.length > 0 ? (
        <div className="pt-3">
          <DtErrors messages={errorMessages} />
        </div>
      ) : null}
      <DtToolbar searchPlaceholder={searchPlaceholder} />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {table.getHeaderGroups()[0]?.headers.map((header) => {
                const columnDef = (
                  header.column.columnDef.meta as { columnDef?: DataTableColumnDef } | undefined
                )?.columnDef;
                const sortable = columnDef?.sortable ?? false;
                const align = columnDef?.align ?? 'left';
                const isActions = (header.column.columnDef.meta as { isActions?: boolean })?.isActions;

                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      cellAlignClass(align),
                      sortable && !isActions && 'cursor-pointer select-none',
                    )}
                    style={{
                      width: columnDef?.width ?? undefined,
                      minWidth: columnDef?.minWidth ?? undefined,
                    }}
                    onClick={() => {
                      if (!columnDef || isActions) {
                        return;
                      }

                      toggleSort(columnDef.fieldName, sortable);
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <span className="inline-flex items-center">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {columnDef ? (
                          <SortIndicator
                            fieldName={columnDef.fieldName}
                            sortable={sortable}
                            sort={tableState.sort}
                          />
                        ) : null}
                      </span>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
            {showColumnSearch ? (
              <DtColumnFilters
                visibleColumns={visibleColumns}
                hasActionsColumn={hasActionsColumn}
              />
            ) : null}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {tanstackColumns.map((column) => (
                    <TableCell key={column.id}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={tanstackColumns.length} className="h-24 text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined}>
                  {row.getVisibleCells().map((cell) => {
                    const columnDef = (
                      cell.column.columnDef.meta as { columnDef?: DataTableColumnDef } | undefined
                    )?.columnDef;
                    const align = columnDef?.align ?? 'left';

                    return (
                      <TableCell key={cell.id} className={cellAlignClass(align)}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="pt-3">
        <DtPagination />
      </div>
    </div>
  );
}

export function DataTable<TRow extends object>(props: DataTableProps<TRow>) {
  const {
    columns,
    rowId,
    actionsColumn,
    emptyMessage,
    title,
    headerActions,
    searchPlaceholder,
    ...providerProps
  } = props;

  return (
    <DataTableProvider {...providerProps}>
      <DataTableView
        columns={columns}
        rowId={rowId}
        actionsColumn={actionsColumn}
        emptyMessage={emptyMessage}
        title={title}
        headerActions={headerActions}
        searchPlaceholder={searchPlaceholder}
      />
    </DataTableProvider>
  );
}

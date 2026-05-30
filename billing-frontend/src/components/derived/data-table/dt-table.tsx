import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { DtActionsColumnHeader } from '@/components/derived/data-table/dt-actions-column-header';
import { DtColumnFilters } from '@/components/derived/data-table/dt-column-filters';
import {
  actionsColumnStyle,
  computeDataTableLayout,
  dataColumnStyle,
  DT_STICKY_ACTIONS_CELL_CLASS,
  DT_STICKY_ACTIONS_HEAD_CLASS,
  estimateActionsInlineMinWidthPx,
  getActionsColumnWidthPercent,
  shouldUseActionsEllipsisMode,
} from '@/components/derived/data-table/dt-column-layout';
import { estimateRowActionsInlineMinWidthPx } from '@/components/derived/data-table/dt-row-action-items';
import { DtRowActionsBar } from '@/components/derived/data-table/dt-row-actions';
import { DataTableProvider } from '@/components/derived/data-table/dt-provider';
import { DtErrors } from '@/components/derived/data-table/dt-errors';
import { DtHeader } from '@/components/derived/data-table/dt-header';
import { DtPagination } from '@/components/derived/data-table/dt-pagination';
import { DtToolbar } from '@/components/derived/data-table/dt-toolbar';
import {
  type DataTableColumnDef,
  type DataTableMutationsHandle,
  type DataTableProps,
  type DataTableSortState,
  partitionDataTableColumns,
} from '@/components/derived/data-table/dt-types';
import { DataTableCell } from '@/components/derived/data-table/column-cells';
import {
  applyColumnFilters,
  dataTableColumnAlignClass,
  getVisibleDataTableColumns,
  inactiveDataTableRowClassName,
} from '@/components/derived/data-table/dt-utils';
import { useDataTable } from '@/components/derived/data-table/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

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
  visibleDataColumns: DataTableColumnDef[],
  rowId: (row: TRow) => number,
  mutations: DataTableMutationsHandle,
  renderRowActions: DataTableProps<TRow>['renderRowActions'],
  actionsColumnMeta: DataTableColumnDef | null,
  actionsEllipsisMode: boolean,
): ColumnDef<TRow>[] {
  const dataColumns: ColumnDef<TRow>[] = visibleDataColumns.map((column) => ({
    id: column.id,
    accessorFn: (row) => row[column.fieldName as keyof TRow],
    header: column.header,
    cell: ({ row }) => (
      <DataTableCell value={row.getValue(column.id)} column={column} />
    ),
    meta: { columnDef: column },
  }));

  if (!actionsColumnMeta || !renderRowActions) {
    return dataColumns;
  }

  const isPending = Boolean(
    mutations.update?.isPending ||
      mutations.delete?.isPending ||
      mutations.toggle?.isPending,
  );

  return [
    ...dataColumns,
    {
      id: actionsColumnMeta.id,
      header: actionsColumnMeta.header,
      cell: ({ row }) => {
        const items = renderRowActions({
          row: row.original,
          rowId: rowId(row.original),
          mutations,
        });

        return (
          <DtRowActionsBar
            items={items}
            align={actionsColumnMeta.align}
            ellipsisMode={actionsEllipsisMode}
            isPending={isPending}
          />
        );
      },
      meta: { isActions: true, columnDef: actionsColumnMeta },
    },
  ];
}

type DataTableViewProps<TRow extends object> = Pick<
  DataTableProps<TRow>,
  | 'columns'
  | 'rowId'
  | 'renderRowActions'
  | 'emptyMessage'
  | 'title'
  | 'headerActions'
  | 'searchPlaceholder'
>;

function DataTableView<TRow extends object>({
  columns,
  rowId,
  renderRowActions,
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

  const { dataColumns, actionsColumn: actionsColumnMeta } = useMemo(
    () => partitionDataTableColumns(columns),
    [columns],
  );

  const visibleDataColumns = useMemo(
    () => getVisibleDataTableColumns(dataColumns, columnVisibility),
    [dataColumns, columnVisibility],
  );

  const displayRows = useMemo(
    () => applyColumnFilters(rows, visibleDataColumns, columnFilters),
    [rows, visibleDataColumns, columnFilters],
  );

  const showActionsColumn = Boolean(actionsColumnMeta && renderRowActions);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [tableContainerWidth, setTableContainerWidth] = useState(0);

  useLayoutEffect(() => {
    const element = scrollContainerRef.current;
    if (!element) {
      return;
    }

    const updateWidth = () => {
      setTableContainerWidth(element.clientWidth);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const configuredActionsWidthPercent = getActionsColumnWidthPercent(columns);

  const actionsInlineMinWidthPx = useMemo(() => {
    if (!renderRowActions) {
      return estimateActionsInlineMinWidthPx({
        update: Boolean(mutations.update),
        toggle: Boolean(mutations.toggle),
        delete: Boolean(mutations.delete),
      });
    }

    if (displayRows.length > 0) {
      const sampleRow = displayRows[0];
      const items = renderRowActions({
        row: sampleRow,
        rowId: rowId(sampleRow),
        mutations,
      });
      return estimateRowActionsInlineMinWidthPx(items);
    }

    return estimateActionsInlineMinWidthPx({
      update: Boolean(mutations.update),
      toggle: Boolean(mutations.toggle),
      delete: Boolean(mutations.delete),
    });
  }, [renderRowActions, displayRows, rowId, mutations, mutations.delete, mutations.toggle, mutations.update]);

  const actionsEllipsisMode = useMemo(
    () =>
      showActionsColumn &&
      shouldUseActionsEllipsisMode(
        tableContainerWidth,
        configuredActionsWidthPercent,
        actionsInlineMinWidthPx,
      ),
    [
      showActionsColumn,
      tableContainerWidth,
      configuredActionsWidthPercent,
      actionsInlineMinWidthPx,
    ],
  );

  const layout = useMemo(
    () =>
      computeDataTableLayout(visibleDataColumns, configuredActionsWidthPercent, {
        actionsEllipsisMode,
        tableContainerWidthPx: tableContainerWidth,
      }),
    [visibleDataColumns, configuredActionsWidthPercent, actionsEllipsisMode, tableContainerWidth],
  );

  const tanstackColumns = useMemo(
    () =>
      buildTanStackColumns(
        visibleDataColumns,
        rowId,
        mutations,
        renderRowActions,
        showActionsColumn ? actionsColumnMeta : null,
        actionsEllipsisMode,
      ),
    [
      visibleDataColumns,
      rowId,
      mutations,
      renderRowActions,
      showActionsColumn,
      actionsColumnMeta,
      actionsEllipsisMode,
    ],
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
  const skeletonRowCount = 5;
  const columnCount = visibleDataColumns.length + (showActionsColumn ? 1 : 0);

  return (
    <div className="space-y-0 rounded-md border p-4 sm:p-2">
      <DtHeader title={title} actions={headerActions} />
      {errorMessages.length == 0 ? (
        <div className="pt-3">
          <DtErrors messages={errorMessages} />
        </div>
      ) : null}
      <DtToolbar searchPlaceholder={searchPlaceholder} />

      <div ref={scrollContainerRef} className="relative w-full overflow-x-auto rounded-md border">
        <table
          className="caption-bottom text-sm"
          style={{
            width: `${layout.tableWidthPercent}%`,
            minWidth: `${layout.tableWidthPercent}%`,
            tableLayout: 'fixed',
          }}
        >
          <thead className="[&_tr]:border-b">
            <tr className="border-b">
              {visibleDataColumns.map((column) => (
                <th
                  key={column.id}
                  className={cn(
                    'h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground',
                    dataTableColumnAlignClass(column.align),
                    column.sortable && 'cursor-pointer select-none',
                  )}
                  style={dataColumnStyle(layout, column.id)}
                  onClick={() => toggleSort(column.fieldName, column.sortable)}
                >
                  <span className="inline-flex items-center">
                    {column.header}
                    <SortIndicator
                      fieldName={column.fieldName}
                      sortable={column.sortable}
                      sort={tableState.sort}
                    />
                  </span>
                </th>
              ))}
              {showActionsColumn && actionsColumnMeta ? (
                <th
                  className={cn(
                    'h-10 px-2 align-middle font-medium whitespace-nowrap text-foreground',
                    dataTableColumnAlignClass(actionsColumnMeta.align),
                    DT_STICKY_ACTIONS_HEAD_CLASS,
                  )}
                  style={actionsColumnStyle(layout)}
                >
                  <DtActionsColumnHeader
                    align={actionsColumnMeta.align}
                    label={actionsColumnMeta.header}
                    ellipsisMode={actionsEllipsisMode}
                  />
                </th>
              ) : null}
            </tr>
            {showColumnSearch ? (
              <DtColumnFilters
                layout={layout}
                visibleDataColumns={visibleDataColumns}
                showActionsColumn={showActionsColumn}
                actionsColumn={actionsColumnMeta}
              />
            ) : null}
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {isLoading ? (
              Array.from({ length: skeletonRowCount }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="border-b">
                  {visibleDataColumns.map((column) => (
                    <td
                      key={`${index}-${column.id}`}
                      className="p-2 align-middle"
                      style={dataColumnStyle(layout, column.id)}
                    >
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                  {showActionsColumn ? (
                    <td
                      className={cn('p-2 align-middle', DT_STICKY_ACTIONS_CELL_CLASS)}
                      style={actionsColumnStyle(layout)}
                    >
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ) : null}
                </tr>
              ))
            ) : displayRows.length === 0 ? (
              <tr className="border-b">
                <td colSpan={columnCount} className="h-24 p-2 text-center align-middle">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    'group border-b transition-colors hover:bg-muted/50',
                    inactiveDataTableRowClassName(row.original),
                  )}
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                >
                  {row.getVisibleCells().map((cell) => {
                    const columnDef = (
                      cell.column.columnDef.meta as { columnDef?: DataTableColumnDef } | undefined
                    )?.columnDef;
                    const align = columnDef?.align ?? 'left';
                    const isActions = (cell.column.columnDef.meta as { isActions?: boolean })
                      ?.isActions;

                    return (
                      <td
                        key={cell.id}
                        className={cn(
                          'max-w-0 p-2 align-middle whitespace-nowrap',
                          dataTableColumnAlignClass(align),
                          isActions && DT_STICKY_ACTIONS_CELL_CLASS,
                        )}
                        style={
                          isActions
                            ? actionsColumnStyle(layout)
                            : columnDef
                              ? dataColumnStyle(layout, columnDef.id)
                              : undefined
                        }
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
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
    renderRowActions,
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
        renderRowActions={renderRowActions}
        emptyMessage={emptyMessage}
        title={title}
        headerActions={headerActions}
        searchPlaceholder={searchPlaceholder}
      />
    </DataTableProvider>
  );
}

import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, ChevronRight } from 'lucide-react';
import { DtActionsColumnHeader } from '@/components/derived/data-table/dt-actions-column-header';
import { DtColumnFilters } from '@/components/derived/data-table/dt-column-filters';
import { DataTableExpandedRowPanel } from '@/components/derived/data-table/dt-expanded-row-panel';
import { DtTableFetchProgress } from '@/components/derived/data-table/dt-table-fetch-progress';
import {
  actionsColumnStyle,
  computeDataTableLayout,
  dataColumnStyle,
  getStickyActionsCellClass,
  getStickyActionsHeadClass,
  estimateActionsInlineMinWidthPx,
  getActionsColumnWidthPercent,
  shouldUseActionsEllipsisMode,
} from '@/components/derived/data-table/dt-column-layout';
import { estimateRowActionsInlineMinWidthPx } from '@/components/derived/data-table/dt-row-action-items';
import { DtRowActionsBar } from '@/components/derived/data-table/dt-row-actions';
import { useActionsColumnOverlay } from '@/components/derived/data-table/use-actions-column-overlay';
import { DataTableProvider } from '@/components/derived/data-table/dt-provider';
import { DtErrors } from '@/components/derived/data-table/dt-errors';
import { DtHeader } from '@/components/derived/data-table/dt-header';
import { DtPagination } from '@/components/derived/data-table/dt-pagination';
import { DtToolbar } from '@/components/derived/data-table/dt-toolbar';
import {
  DT_EXPAND_COLUMN_ID,
  DT_TABLE_HEADER_BG_CLASS,
  DT_TABLE_HEADER_HEIGHT_CLASS,
  DT_TABLE_HEADER_STICKY_CLASS,
} from '@/components/derived/data-table/dt-constants';
import { useDataTableMaxHeight } from '@/components/derived/data-table/use-data-table-max-height';
import {
  type DataTableColumnDef,
  type DataTableMutationsHandle,
  type DataTableProps,
  type DataTableRowExpansionConfig,
  type DataTableSortState,
  partitionDataTableColumns,
} from '@/components/derived/data-table/dt-types';
import { DataTableCell } from '@/components/derived/data-table/column-cells';
import {
  applyColumnFilters,
  dataTableColumnAlignClass,
  getExpandedDetailColumns,
  getVisibleDataTableColumns,
  inactiveDataTableRowClassName,
} from '@/components/derived/data-table/dt-utils';
import { useDataTable } from '@/components/derived/data-table/hooks';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/useMobile';
import { cn } from '@/lib/utils';

const EXPAND_COLUMN_CLASS = 'w-10 min-w-10 max-w-10 p-0 ps-1';

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

type DataTableViewProps<TRow extends object, TDetail> = Pick<
  DataTableProps<TRow, TDetail>,
  | 'columns'
  | 'rowId'
  | 'renderRowActions'
  | 'rowExpansion'
  | 'emptyMessage'
  | 'title'
  | 'headerActions'
  | 'searchPlaceholder'
  | 'maxHeight'
  | 'pagination'
>;

function DataTableView<TRow extends object, TDetail = TRow>({
  columns,
  rowId,
  renderRowActions,
  rowExpansion,
  emptyMessage = 'No results.',
  title,
  headerActions,
  searchPlaceholder,
  maxHeight,
  pagination,
}: DataTableViewProps<TRow, TDetail>) {
  const isMobile = useIsMobile();
  const {
    tableState,
    rows,
    isLoading,
    isFetching,
    errorMessage,
    mutations,
    toggleSort,
    columnVisibility,
    showColumnSearch,
    columnFilters,
    setColumns,
    expandedRowIds,
    toggleExpandedRowId,
    setExpandedRowIds,
  } = useDataTable<TRow>();

  useEffect(() => {
    setColumns(columns);
  }, [columns, setColumns]);

  useEffect(() => {
    if (isMobile && expandedRowIds.length > 1) {
      setExpandedRowIds([expandedRowIds[expandedRowIds.length - 1]!]);
    }
  }, [isMobile, expandedRowIds, setExpandedRowIds]);

  const { dataColumns, actionsColumn: actionsColumnMeta } = useMemo(
    () => partitionDataTableColumns(columns),
    [columns],
  );

  const detailColumns = useMemo(() => getExpandedDetailColumns(dataColumns), [dataColumns]);

  const visibleDataColumns = useMemo(
    () => getVisibleDataTableColumns(dataColumns, columnVisibility, { isMobile }),
    [dataColumns, columnVisibility, isMobile],
  );

  const displayRows = useMemo(
    () => applyColumnFilters(rows, visibleDataColumns, columnFilters),
    [rows, visibleDataColumns, columnFilters],
  );

  const showActionsColumn = Boolean(actionsColumnMeta && renderRowActions);
  const showExpandColumn = Boolean(rowExpansion);

  const rootRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const resolvedMaxHeight = useDataTableMaxHeight(rootRef, maxHeight);
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
  const columnCount =
    visibleDataColumns.length +
    (showExpandColumn ? 1 : 0) +
    (showActionsColumn ? 1 : 0);
  const isActionsColumnOverlaying = useActionsColumnOverlay(scrollContainerRef, showActionsColumn);
  const stickyActionsHeadClass = cn(
    getStickyActionsHeadClass(isActionsColumnOverlaying),
    DT_TABLE_HEADER_STICKY_CLASS,
    DT_TABLE_HEADER_HEIGHT_CLASS,
    'z-40',
  );
  const stickyActionsCellClass = getStickyActionsCellClass(isActionsColumnOverlaying);
  const showFetchProgress = isFetching && !isLoading;

  const handleToggleExpand = (id: number) => {
    toggleExpandedRowId(id, isMobile);
  };

  const renderExpandHeaderCell = () => {
    if (!showExpandColumn) {
      return null;
    }

    return (
      <th
        key={DT_EXPAND_COLUMN_ID}
        className={cn(
          DT_TABLE_HEADER_STICKY_CLASS,
          DT_TABLE_HEADER_HEIGHT_CLASS,
          DT_TABLE_HEADER_BG_CLASS,
          EXPAND_COLUMN_CLASS,
          'align-middle',
        )}
        aria-label="Expand row"
      />
    );
  };

  const renderExpandBodyCell = (id: number) => {
    if (!showExpandColumn) {
      return null;
    }

    const isExpanded = expandedRowIds.includes(id);

    return (
      <td key={`${id}-expand`} className={cn('align-middle', EXPAND_COLUMN_CLASS)}>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
          onClick={() => handleToggleExpand(id)}
        >
          {isExpanded ? (
            <ChevronDown className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
        </Button>
      </td>
    );
  };

  const renderExpandedDetailRow = (original: TRow, id: number) => {
    if (!rowExpansion || !expandedRowIds.includes(id)) {
      return null;
    }

    return (
      <tr key={`${id}-detail`} className="border-b bg-muted/30">
        <td colSpan={columnCount} className="p-3 align-top sm:p-4">
          <DataTableExpandedRowPanel
            row={original}
            rowId={id}
            detailColumns={detailColumns}
            rowExpansion={rowExpansion as DataTableRowExpansionConfig<TRow, TDetail>}
          />
        </td>
      </tr>
    );
  };

  return (
    <div
      ref={rootRef}
      className="flex min-h-0 flex-col space-y-0 overflow-hidden rounded-md border p-2 md:p-3"
      style={resolvedMaxHeight ? { maxHeight: resolvedMaxHeight } : undefined}
    >
      <DtHeader title={title} actions={headerActions} />
      {errorMessages.length > 0 ? (
        <div className="pt-3">
          <DtErrors messages={errorMessages} />
        </div>
      ) : null}
      <DtToolbar searchPlaceholder={searchPlaceholder} />

      <div
        ref={scrollContainerRef}
        className="relative min-h-0 w-full flex-1 overflow-auto rounded-md border"
      >
        <table
          className="caption-bottom text-sm"
          style={{
            width: `${layout.tableWidthPercent}%`,
            minWidth: `${layout.tableWidthPercent}%`,
            tableLayout: 'fixed',
          }}
        >
          <thead className={cn('[&_tr]:border-b', DT_TABLE_HEADER_BG_CLASS)}>
            <tr className="border-b">
              {renderExpandHeaderCell()}
              {visibleDataColumns.map((column) => (
                <th
                  key={column.id}
                  className={cn(
                    DT_TABLE_HEADER_STICKY_CLASS,
                    DT_TABLE_HEADER_HEIGHT_CLASS,
                    DT_TABLE_HEADER_BG_CLASS,
                    'px-2 text-left align-middle font-medium whitespace-nowrap text-foreground',
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
                    DT_TABLE_HEADER_HEIGHT_CLASS,
                    'px-2 align-middle font-medium whitespace-nowrap text-foreground',
                    dataTableColumnAlignClass(actionsColumnMeta.align),
                    stickyActionsHeadClass,
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
                showExpandColumn={showExpandColumn}
                showActionsColumn={showActionsColumn}
                actionsColumn={actionsColumnMeta}
                isActionsColumnOverlaying={isActionsColumnOverlaying}
              />
            ) : null}
            <DtTableFetchProgress
              columnCount={columnCount}
              showColumnSearch={showColumnSearch}
              visible={showFetchProgress}
            />
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {isLoading ? (
              Array.from({ length: skeletonRowCount }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="border-b">
                  {showExpandColumn ? (
                    <td className={cn('align-middle', EXPAND_COLUMN_CLASS)}>
                      <Skeleton className="mx-auto size-8 rounded-md" />
                    </td>
                  ) : null}
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
                      className={cn('p-2 align-middle', stickyActionsCellClass)}
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
              table.getRowModel().rows.map((row) => {
                const id = rowId(row.original);

                return (
                  <Fragment key={row.id}>
                    <tr
                      className={cn(
                        'group border-b transition-colors hover:bg-muted/50',
                        inactiveDataTableRowClassName(row.original),
                        expandedRowIds.includes(id) && 'bg-muted/20',
                      )}
                      data-state={row.getIsSelected() ? 'selected' : undefined}
                    >
                      {renderExpandBodyCell(id)}
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
                              isActions && stickyActionsCellClass,
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
                    {renderExpandedDetailRow(row.original, id)}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="shrink-0 pt-3">
        <DtPagination options={pagination} />
      </div>
    </div>
  );
}

export function DataTable<TRow extends object, TDetail = TRow>(
  props: DataTableProps<TRow, TDetail>,
) {
  const {
    columns,
    rowId,
    renderRowActions,
    rowExpansion,
    emptyMessage,
    title,
    headerActions,
    searchPlaceholder,
    maxHeight,
    pagination,
    ...providerProps
  } = props;

  return (
    <DataTableProvider {...providerProps}>
      <DataTableView
        columns={columns}
        rowId={rowId}
        renderRowActions={renderRowActions}
        rowExpansion={rowExpansion}
        emptyMessage={emptyMessage}
        title={title}
        headerActions={headerActions}
        searchPlaceholder={searchPlaceholder}
        maxHeight={maxHeight}
        pagination={pagination}
      />
    </DataTableProvider>
  );
}

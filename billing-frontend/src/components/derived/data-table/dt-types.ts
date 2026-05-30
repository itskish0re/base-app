import type { UseMutationOptions, UseMutationResult, UseQueryOptions } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { DT_COLUMN_COMPONENT_ACTIONS } from '@/components/derived/data-table/dt-constants';
import type {
  DataTableRowActionItem,
} from '@/components/derived/data-table/dt-row-action-items';
import type { ListQueryParams, PagedResponse } from '@/types/common';
import type {
  EntityScreenMetadataDto,
  ScreenColumnMetadataDto,
} from '@/types/entity/screen';

/** Default debounce for global filter before refetch (ms). */
export const DT_FILTER_DEBOUNCE_MS = 300;

export type DataTableSortDirection = 'asc' | 'desc';

export interface DataTablePaginationState {
  page: number;
  pageSize: number;
}

export interface DataTableSortState {
  fieldName: string;
  direction: DataTableSortDirection;
}

export interface DataTableFilterState {
  /** Sent as `ListQueryParams.filter` after debounce. */
  global: string;
}

export type DataTableSelectionMode = 'none' | 'single' | 'multiple';

export interface DataTableSelectionState {
  mode: DataTableSelectionMode;
  selectedIds: number[];
}

/** Controlled UI state stored on the screen slice (`table` field). */
export interface DataTableState {
  pagination: DataTablePaginationState;
  sort: DataTableSortState | null;
  filter: DataTableFilterState;
  selection: DataTableSelectionState;
}

export function createInitialDataTableState(
  overrides?: Partial<DataTableState>,
): DataTableState {
  return {
    pagination: { page: 1, pageSize: 20, ...overrides?.pagination },
    sort: overrides?.sort ?? null,
    filter: { global: '', ...overrides?.filter },
    selection: {
      mode: 'single',
      selectedIds: [],
      ...overrides?.selection,
    },
  };
}

export function dataTableStateToListQueryParams(state: DataTableState): ListQueryParams {
  const params: ListQueryParams = {
    page: state.pagination.page,
    pageSize: state.pagination.pageSize,
  };

  const filter = state.filter.global.trim();
  if (filter) {
    params.filter = filter;
  }

  if (state.sort) {
    params.orderBy = `${state.sort.fieldName} ${state.sort.direction}`;
  }

  return params;
}

export interface DataTableColumnDef {
  id: string;
  /** CamelCase from screen metadata; matches list DTO property names. */
  fieldName: string;
  header: string;
  dataType: string;
  /** Share of grid base width (100); columns may sum above 100 for horizontal scroll. */
  widthPercent: number | null;
  isPinned?: boolean;
  align?: 'left' | 'center' | 'right';
  sortable: boolean;
  visible: boolean;
  columnComponent: string | null;
}

/** First entity on the screen (primary grid). */
export function getPrimaryEntityColumns(
  entities: EntityScreenMetadataDto[],
): ScreenColumnMetadataDto[] {
  return entities[0]?.columns ?? [];
}

export function isActionsColumn(column: DataTableColumnDef): boolean {
  return column.columnComponent === DT_COLUMN_COMPONENT_ACTIONS;
}

export function mapScreenColumnToDataTableColumn(
  column: ScreenColumnMetadataDto,
): DataTableColumnDef {
  return {
    id: String(column.entityScreenColumnId),
    fieldName: column.fieldName,
    header: column.displayLabel ?? column.fieldName,
    dataType: column.dataType,
    widthPercent: column.columnWidthPercent,
    isPinned: column.isPinned,
    align: normalizeColumnAlign(column.align),
    sortable: column.allowSort ?? false,
    visible: column.isVisible,
    columnComponent: column.columnComponent,
  };
}

/** All active screen columns (including actions); used for layout and column picker. */
export function mapScreenColumnsToDataTableColumns(
  columns: ScreenColumnMetadataDto[],
): DataTableColumnDef[] {
  return [...columns]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .filter((column) => column.isActive)
    .map(mapScreenColumnToDataTableColumn);
}

export function partitionDataTableColumns(columns: DataTableColumnDef[]): {
  dataColumns: DataTableColumnDef[];
  actionsColumn: DataTableColumnDef | null;
} {
  const dataColumns: DataTableColumnDef[] = [];
  let actionsColumn: DataTableColumnDef | null = null;

  for (const column of columns) {
    if (isActionsColumn(column)) {
      actionsColumn = column;
    } else {
      dataColumns.push(column);
    }
  }

  return { dataColumns, actionsColumn };
}

/** Grid + column-picker columns (`is_visible` on screen metadata). */
export function isDisplayableGridColumn(column: DataTableColumnDef): boolean {
  return !isActionsColumn(column) && column.visible;
}

export function defaultColumnVisibleInGrid(column: DataTableColumnDef): boolean {
  return isDisplayableGridColumn(column);
}

function normalizeColumnAlign(align: string): 'left' | 'center' | 'right' {
  if (align === 'center' || align === 'right') {
    return align;
  }

  return 'left';
}

export type DataTableQueryOptionsFactory<TRow> = (
  params: ListQueryParams,
) => UseQueryOptions<PagedResponse<TRow>, Error, PagedResponse<TRow>, any>;

/** Mutation option factories the table wires with `useMutation` (keys, invalidation, etc.). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- factories are entity-specific; table exposes loose handles
export type DataTableMutationsConfig = {
  create?: () => UseMutationOptions<any, Error, any, any>;
  update?: () => UseMutationOptions<any, Error, any, any>;
  delete?: () => UseMutationOptions<any, Error, any, any>;
  toggle?: () => UseMutationOptions<any, Error, any, any>;
};

/** Resolved mutations exposed to action column render prop and future built-in actions. */
export type DataTableMutationsHandle = {
  create?: UseMutationResult<any, Error, any, any>;
  update?: UseMutationResult<any, Error, any, any>;
  delete?: UseMutationResult<any, Error, any, any>;
  toggle?: UseMutationResult<any, Error, any, any>;
};

export type DataTableRowActionsRenderProps<TRow> = {
  row: TRow;
  rowId: number;
  mutations: DataTableMutationsHandle;
};

export type DataTableRowActionsRender<TRow> = (
  props: DataTableRowActionsRenderProps<TRow>,
) => DataTableRowActionItem[];

export interface DataTableProps<TRow> {
  /** Top bar: table name (left). */
  title?: ReactNode;
  /** Top bar: e.g. Add button (right). */
  headerActions?: ReactNode;

  /** Bound to screen slice (`table`). */
  value: DataTableState;
  onChange: (next: DataTableState) => void;

  queryOptions: DataTableQueryOptionsFactory<TRow>;
  /** Option factories; table runs `useMutation` and passes results via `actionsColumn` and internally. */
  mutations?: DataTableMutationsConfig;

  columns: DataTableColumnDef[];
  rowId: (row: TRow) => number;

  /** Returns row action items; DataTable renders layout, ellipsis mode, and alignment. */
  renderRowActions?: DataTableRowActionsRender<TRow>;

  /** When false, list query is disabled; table structure still renders from `columns`. */
  enabled?: boolean;
  emptyMessage?: string;
  searchPlaceholder?: string;
}

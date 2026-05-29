import type { UseMutationOptions, UseMutationResult, UseQueryOptions } from '@tanstack/react-query';
import type { ReactNode } from 'react';
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
  fieldName: string;
  header: string;
  dataType: string;
  width?: number | null;
  minWidth?: number | null;
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

export function mapScreenColumnsToDataTableColumns(
  columns: ScreenColumnMetadataDto[],
): DataTableColumnDef[] {
  return [...columns]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .filter((column) => column.isActive && column.isVisible)
    .map((column) => ({
      id: String(column.entityScreenColumnId),
      fieldName: column.fieldName,
      header: column.displayLabel ?? column.fieldName,
      dataType: column.dataType,
      width: column.columnWidth,
      minWidth: column.minWidth,
      isPinned: column.isPinned,
      align: normalizeColumnAlign(column.align),
      sortable: column.allowSort ?? false,
      visible: column.isVisible,
      columnComponent: column.columnComponent,
    }));
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

export type DataTableActionsColumnRenderProps<TRow> = {
  row: TRow;
  rowId: number;
  mutations: DataTableMutationsHandle;
};

export interface DataTableActionsColumnDef<TRow> {
  header?: string;
  width?: number;
  minWidth?: number;
  pinned?: 'right';
  render: (props: DataTableActionsColumnRenderProps<TRow>) => ReactNode;
}

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

  actionsColumn?: DataTableActionsColumnDef<TRow>;

  enabled?: boolean;
  emptyMessage?: string;
  searchPlaceholder?: string;
}

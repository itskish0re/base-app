import { createStore, type StoreApi } from 'zustand';
import { useStore } from 'zustand';
import { defaultColumnVisibleInGrid } from '@/components/derived/data-table/dt-types';
import {
  type DataTableColumnDef,
  type DataTableMutationsHandle,
  type DataTableSortState,
  type DataTableState,
} from '@/components/derived/data-table/dt-types';

/** Ephemeral UI state — lives only in the per-table Zustand instance. */
export type DataTableUiState = {
  activeRowId: number | null;
  openMenuRowId: number | null;
  /** Column defs synced from props (metadata). */
  columns: DataTableColumnDef[];
  columnVisibility: Record<string, boolean>;
  showColumnSearch: boolean;
  columnFilters: Record<string, string>;
};

export type DataTableRuntimeState<TRow> = {
  rows: TRow[];
  totalCount: number;
  isLoading: boolean;
  isFetching: boolean;
  errorMessage: string | null;
  mutationsHandle: DataTableMutationsHandle;
};

export type DataTableStoreState<TRow> = DataTableUiState &
  DataTableRuntimeState<TRow> & {
    /** Mirror of screen slice `table`; updates call `onTableChange`. */
    tableState: DataTableState;
    setTableState: (
      next: DataTableState | ((prev: DataTableState) => DataTableState),
    ) => void;
    setGlobalFilter: (global: string) => void;
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
    toggleSort: (fieldName: string, sortable: boolean) => void;
    setSelectedIds: (selectedIds: number[]) => void;
    setActiveRowId: (rowId: number | null) => void;
    setOpenMenuRowId: (rowId: number | null) => void;
    setColumns: (columns: DataTableColumnDef[]) => void;
    setColumnVisibility: (columnId: string, visible: boolean) => void;
    toggleColumnVisibility: (columnId: string) => void;
    setShowColumnSearch: (show: boolean) => void;
    toggleShowColumnSearch: () => void;
    setColumnFilter: (columnId: string, value: string) => void;
    clearColumnFilters: () => void;
    setRuntime: (patch: Partial<DataTableRuntimeState<TRow>>) => void;
    syncTableState: (tableState: DataTableState) => void;
  };

export type DataTableStoreApi<TRow> = StoreApi<DataTableStoreState<TRow>>;

function toggleSortState(
  tableState: DataTableState,
  fieldName: string,
  sortable: boolean,
): DataTableState {
  if (!sortable) {
    return tableState;
  }

  const current = tableState.sort;
  let next: DataTableSortState | null;

  if (current?.fieldName === fieldName) {
    if (current.direction === 'asc') {
      next = { fieldName, direction: 'desc' };
    } else {
      next = null;
    }
  } else {
    next = { fieldName, direction: 'asc' };
  }

  return {
    ...tableState,
    sort: next,
    pagination: { ...tableState.pagination, page: 1 },
  };
}

export function createDataTableStore<TRow>(
  initialTableState: DataTableState,
  onTableChange: (next: DataTableState) => void,
): DataTableStoreApi<TRow> {
  return createStore<DataTableStoreState<TRow>>((set, get) => ({
    tableState: initialTableState,
    activeRowId: null,
    openMenuRowId: null,
    columns: [],
    columnVisibility: {},
    showColumnSearch: false,
    columnFilters: {},
    rows: [] as TRow[],
    totalCount: 0,
    isLoading: false,
    isFetching: false,
    errorMessage: null,
    mutationsHandle: {},

    setTableState: (next) => {
      const tableState = typeof next === 'function' ? next(get().tableState) : next;
      set({ tableState });
      onTableChange(tableState);
    },

    syncTableState: (tableState) => {
      set({ tableState });
    },

    setGlobalFilter: (global) => {
      get().setTableState((prev) => ({
        ...prev,
        filter: { global },
        pagination: { ...prev.pagination, page: 1 },
      }));
    },

    setPage: (page) => {
      get().setTableState((prev) => ({
        ...prev,
        pagination: { ...prev.pagination, page },
      }));
    },

    setPageSize: (pageSize) => {
      get().setTableState((prev) => ({
        ...prev,
        pagination: { page: 1, pageSize },
      }));
    },

    toggleSort: (fieldName, sortable) => {
      get().setTableState((prev) => toggleSortState(prev, fieldName, sortable));
    },

    setSelectedIds: (selectedIds) => {
      get().setTableState((prev) => ({
        ...prev,
        selection: { ...prev.selection, selectedIds },
      }));
    },

    setActiveRowId: (activeRowId) => set({ activeRowId }),
    setOpenMenuRowId: (openMenuRowId) => set({ openMenuRowId }),

    setColumns: (columns) => {
      const columnVisibility = { ...get().columnVisibility };
      const columnIds = new Set(columns.map((column) => column.id));

      for (const column of columns) {
        if (!(column.id in columnVisibility)) {
          columnVisibility[column.id] = defaultColumnVisibleInGrid(column);
        }
      }

      for (const key of Object.keys(columnVisibility)) {
        if (!columnIds.has(key)) {
          delete columnVisibility[key];
        }
      }

      set({ columns, columnVisibility });
    },

    setColumnVisibility: (columnId, visible) => {
      set({
        columnVisibility: { ...get().columnVisibility, [columnId]: visible },
      });
    },

    toggleColumnVisibility: (columnId) => {
      const current = get().columnVisibility[columnId] ?? true;
      get().setColumnVisibility(columnId, !current);
    },

    setShowColumnSearch: (showColumnSearch) => set({ showColumnSearch }),

    toggleShowColumnSearch: () => {
      set({ showColumnSearch: !get().showColumnSearch });
    },

    setColumnFilter: (columnId, value) => {
      set({
        columnFilters: { ...get().columnFilters, [columnId]: value },
      });
    },

    clearColumnFilters: () => set({ columnFilters: {} }),

    setRuntime: (patch) => set(patch),
  }));
}

export function useDataTableZustandStore<TRow, TSelected>(
  store: DataTableStoreApi<TRow>,
  selector: (state: DataTableStoreState<TRow>) => TSelected,
): TSelected {
  return useStore(store, selector);
}

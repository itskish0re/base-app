import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useDataTableStoreApi } from '@/components/derived/data-table/dt-context';
import { useDataTableZustandStore } from '@/components/derived/data-table/dt-store';
import {
  DT_FILTER_DEBOUNCE_MS,
  dataTableStateToListQueryParams,
  type DataTableMutationsConfig,
  type DataTableMutationsHandle,
  type DataTableProps,
  type DataTableQueryOptionsFactory,
  type DataTableState,
} from '@/components/derived/data-table/dt-types';

/** Read bridged screen table state + runtime + actions from the per-instance Zustand store. */
export function useDataTable<TRow = unknown>() {
  const store = useDataTableStoreApi<TRow>();

  return useDataTableZustandStore(
    store,
    useShallow((state) => ({
      tableState: state.tableState,
      activeRowId: state.activeRowId,
      openMenuRowId: state.openMenuRowId,
      rows: state.rows,
      totalCount: state.totalCount,
      isLoading: state.isLoading,
      isFetching: state.isFetching,
      errorMessage: state.errorMessage,
      mutations: state.mutationsHandle,
      setTableState: state.setTableState,
      setGlobalFilter: state.setGlobalFilter,
      setPage: state.setPage,
      setPageSize: state.setPageSize,
      toggleSort: state.toggleSort,
      setSelectedIds: state.setSelectedIds,
      setActiveRowId: state.setActiveRowId,
      setOpenMenuRowId: state.setOpenMenuRowId,
      columns: state.columns,
      columnVisibility: state.columnVisibility,
      showColumnSearch: state.showColumnSearch,
      columnFilters: state.columnFilters,
      setColumns: state.setColumns,
      setColumnVisibility: state.setColumnVisibility,
      toggleColumnVisibility: state.toggleColumnVisibility,
      setShowColumnSearch: state.setShowColumnSearch,
      toggleShowColumnSearch: state.toggleShowColumnSearch,
      setColumnFilter: state.setColumnFilter,
      clearColumnFilters: state.clearColumnFilters,
    })),
  );
}

/** Debounced copy of table state for server fetch (filter delayed by 300ms). */
export function useDebouncedDataTableQueryState(
  value: DataTableState,
  debounceMs: number = DT_FILTER_DEBOUNCE_MS,
): DataTableState {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handle = window.setTimeout(() => setDebounced(value), debounceMs);
    return () => window.clearTimeout(handle);
  }, [value, debounceMs]);

  return debounced;
}

export function useDataTableListQueryParams(value: DataTableState) {
  const debouncedState = useDebouncedDataTableQueryState(value);
  return useMemo(
    () => dataTableStateToListQueryParams(debouncedState),
    [debouncedState],
  );
}

export type UseDataTableQueryResult<TRow> = {
  params: ReturnType<typeof dataTableStateToListQueryParams>;
  rows: TRow[];
  totalCount: number;
  isLoading: boolean;
  isFetching: boolean;
  error: unknown;
  errorMessage: string | null;
  refetch: () => void;
};

export function useDataTableQuery<TRow>(
  value: DataTableState,
  queryOptions: DataTableQueryOptionsFactory<TRow>,
  enabled = true,
): UseDataTableQueryResult<TRow> {
  const params = useDataTableListQueryParams(value);
  const options = queryOptions(params);
  const query = useQuery({
    ...options,
    queryKey: options.queryKey ?? ['data-table', 'list', params],
    queryFn: options.queryFn ?? (async () => ({ items: [], page: 1, pageSize: 20, totalCount: 0 })),
    enabled,
  });

  const errorMessage =
    query.error instanceof Error ? query.error.message : query.error ? String(query.error) : null;

  return {
    params,
    rows: query.data?.items ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    errorMessage,
    refetch: query.refetch,
  };
}

function useOptionalMutation(
  factory: DataTableMutationsConfig[keyof DataTableMutationsConfig] | undefined,
) {
  const options = useMemo(
    () =>
      factory?.() ?? {
        mutationKey: ['data-table', 'unused'],
        mutationFn: async () => undefined,
      },
    [factory],
  );

  return useMutation(options);
}

export function useDataTableMutations(
  config: DataTableMutationsConfig | undefined,
): DataTableMutationsHandle {
  const createMutation = useOptionalMutation(config?.create);
  const updateMutation = useOptionalMutation(config?.update);
  const deleteMutation = useOptionalMutation(config?.delete);
  const toggleMutation = useOptionalMutation(config?.toggle);

  return useMemo(
    () => ({
      ...(config?.create ? { create: createMutation } : {}),
      ...(config?.update ? { update: updateMutation } : {}),
      ...(config?.delete ? { delete: deleteMutation } : {}),
      ...(config?.toggle ? { toggle: toggleMutation } : {}),
    }),
    [config, createMutation, updateMutation, deleteMutation, toggleMutation],
  );
}

export function useDataTableController<TRow>(
  props: Pick<DataTableProps<TRow>, 'value' | 'queryOptions' | 'mutations' | 'enabled'>,
) {
  const query = useDataTableQuery(props.value, props.queryOptions, props.enabled ?? true);
  const mutationsHandle = useDataTableMutations(props.mutations);

  return {
    ...query,
    mutationsHandle,
  };
}

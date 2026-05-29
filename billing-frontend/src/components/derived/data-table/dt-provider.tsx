import { useEffect, useRef, type ReactNode } from 'react';
import { DataTableStoreProvider } from '@/components/derived/data-table/dt-context';
import {
  createDataTableStore,
  type DataTableStoreApi,
} from '@/components/derived/data-table/dt-store';
import type { DataTableProps } from '@/components/derived/data-table/dt-types';
import { useDataTableController } from '@/components/derived/data-table/hooks';

type DataTableProviderProps<TRow extends object> = Omit<
  DataTableProps<TRow>,
  'columns' | 'rowId' | 'actionsColumn' | 'emptyMessage' | 'title' | 'headerActions' | 'searchPlaceholder'
> & {
  children: ReactNode;
};

export function DataTableProvider<TRow extends object>({
  value,
  onChange,
  queryOptions,
  mutations,
  enabled = true,
  children,
}: DataTableProviderProps<TRow>) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const storeRef = useRef<DataTableStoreApi<TRow> | null>(null);
  if (!storeRef.current) {
    storeRef.current = createDataTableStore<TRow>(value, (next) => {
      onChangeRef.current(next);
    });
  }

  const store = storeRef.current;

  useEffect(() => {
    if (store.getState().tableState !== value) {
      store.getState().syncTableState(value);
    }
  }, [store, value]);

  const { rows, totalCount, isLoading, isFetching, errorMessage, mutationsHandle } =
    useDataTableController({
      value,
      queryOptions,
      mutations,
      enabled,
    });

  useEffect(() => {
    store.getState().setRuntime({
      rows,
      totalCount,
      isLoading,
      isFetching,
      errorMessage,
      mutationsHandle,
    });
  }, [store, rows, totalCount, isLoading, isFetching, errorMessage, mutationsHandle]);

  return <DataTableStoreProvider store={store}>{children}</DataTableStoreProvider>;
}

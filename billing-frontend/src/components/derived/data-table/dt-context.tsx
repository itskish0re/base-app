import { createContext, useContext, type ReactNode } from 'react';
import type { DataTableStoreApi } from '@/components/derived/data-table/dt-store';

const DataTableStoreContext = createContext<DataTableStoreApi<unknown> | null>(null);

export function DataTableStoreProvider<TRow>({
  store,
  children,
}: {
  store: DataTableStoreApi<TRow>;
  children: ReactNode;
}) {
  return (
    <DataTableStoreContext.Provider value={store as DataTableStoreApi<unknown>}>
      {children}
    </DataTableStoreContext.Provider>
  );
}

export function useDataTableStoreApi<TRow>(): DataTableStoreApi<TRow> {
  const store = useContext(DataTableStoreContext);
  if (!store) {
    throw new Error('useDataTableStoreApi must be used within DataTableProvider.');
  }

  return store as DataTableStoreApi<TRow>;
}

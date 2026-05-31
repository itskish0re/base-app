import type { QueryClient } from '@tanstack/react-query';

export const FINANCIAL_YEAR_SCOPED_QUERY_META = {
  financialYearScoped: true,
} as const;

/** Invalidate React Query caches for transaction grids/lists when FY changes. */
export function invalidateFinancialYearScopedQueries(queryClient: QueryClient) {
  queryClient.invalidateQueries({
    predicate: (query) => query.meta?.financialYearScoped === true,
  });
}

/** Append FY id to a query key so caches are partitioned per year. */
export function withFinancialYearQueryKey<T extends readonly unknown[]>(
  queryKey: T,
  financialYearId: number | null,
  financialYearScoped: boolean,
): readonly [...T, { financialYearId: number | null }] | T {
  if (!financialYearScoped) {
    return queryKey;
  }

  return [...queryKey, { financialYearId }] as const;
}

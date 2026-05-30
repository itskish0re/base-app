import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { fetchScreenByMenuCode } from '@/service/api/functions/screens';
import { isQueryAbortError } from '@/service/query/query-errors';
import { store } from '@/store/store';

const SCREEN_METADATA_STALE_TIME_MS = 30 * 60 * 1000;

export function screenByMenuQueryOptions(menuCode: string) {
  return queryOptions({
    queryKey: queryKeys.screens.byMenu(menuCode),
    queryFn: ({ signal }) => fetchScreenByMenuCode(menuCode, signal),
    enabled: Boolean(menuCode) && Boolean(store.getState().auth.accessToken),
    staleTime: 0,
    gcTime: SCREEN_METADATA_STALE_TIME_MS,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => !isQueryAbortError(error) && failureCount < 1,
  });
}

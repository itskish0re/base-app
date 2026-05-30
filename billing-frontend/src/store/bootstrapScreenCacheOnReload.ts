import { queryKeys } from '@/constants/queryKeys';
import { screenCacheActions } from '@/store/global/screenCacheSlice';
import type { AppDispatch } from '@/store/store';
import type { QueryClient } from '@tanstack/react-query';

function isBrowserReload(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const entry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  return entry?.type === 'reload';
}

/** Clears in-memory screen metadata when the user hard-refreshes the app. */
export function bootstrapScreenCacheOnReload(
  dispatch: AppDispatch,
  queryClient: QueryClient,
): void {
  if (!isBrowserReload()) {
    return;
  }

  dispatch(screenCacheActions.resetScreenCache());
  queryClient.removeQueries({ queryKey: queryKeys.screens.all });
}

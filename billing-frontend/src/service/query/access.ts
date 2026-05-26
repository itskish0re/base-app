import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { fetchNavigationMenus } from '@/service/api/functions/access';

export const navigationQueryKey = queryKeys.access.navigation;

/** TanStack Query options for GET /api/access/navigation. */
export function navigationQueryOptions(options?: { enabled?: boolean }) {
  return queryOptions({
    queryKey: navigationQueryKey(),
    queryFn: fetchNavigationMenus,
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
  });
}

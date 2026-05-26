import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { fetchNavigationMenus } from '@/service/api/functions/access';
import { store } from '@/store/store';

export function navigationQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.access.navigation(),
    queryFn: fetchNavigationMenus,
    enabled: Boolean(store.getState().auth.accessToken),
  });
}

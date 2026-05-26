import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { fetchScreenByMenuCode } from '@/service/api/functions/screens';
import { store } from '@/store/store';

export function screenByMenuQueryOptions(menuCode: string) {
  return queryOptions({
    queryKey: queryKeys.screens.byMenu(menuCode),
    queryFn: () => fetchScreenByMenuCode(menuCode),
    enabled: Boolean(menuCode) && Boolean(store.getState().auth.accessToken),
  });
}

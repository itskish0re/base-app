import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { getMenuById, listMenus } from '@/service/api/functions/menus';
import type { ListMenusParams } from '@/types/menu';

export function listMenusQueryOptions(params?: ListMenusParams) {
  return queryOptions({
    queryKey: queryKeys.menus.list(params),
    queryFn: () => listMenus(params),
  });
}

export function menuByIdQueryOptions(id: number) {
  return queryOptions({
    queryKey: queryKeys.menus.detail(id),
    queryFn: () => getMenuById(id),
    enabled: id > 0,
  });
}

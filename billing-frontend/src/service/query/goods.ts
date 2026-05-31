import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { getGoodsById, listGoods } from '@/service/api/functions/goods';
import type { ListQueryParams } from '@/types/common';

export function listGoodsQueryOptions(params?: ListQueryParams) {
  return queryOptions({
    queryKey: queryKeys.goods.list(params),
    queryFn: () => listGoods(params),
  });
}

export function goodsByIdQueryOptions(id: number) {
  return queryOptions({
    queryKey: queryKeys.goods.detail(id),
    queryFn: () => getGoodsById(id),
    enabled: id > 0,
  });
}

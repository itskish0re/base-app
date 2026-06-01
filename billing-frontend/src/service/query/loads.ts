import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { listLoads } from '@/service/api/functions/loads';
import type { ListQueryParams } from '@/types/common';

export function listLoadsQueryOptions(params?: ListQueryParams) {
  return queryOptions({
    queryKey: queryKeys.loads.list(params),
    queryFn: () => listLoads(params),
  });
}

import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { getTruckById, listTrucks } from '@/service/api/functions/trucks';
import type { ListQueryParams } from '@/types/common';

export function listTrucksQueryOptions(params?: ListQueryParams) {
  return queryOptions({
    queryKey: queryKeys.trucks.list(params),
    queryFn: () => listTrucks(params),
  });
}

export function truckByIdQueryOptions(id: number) {
  return queryOptions({
    queryKey: queryKeys.trucks.detail(id),
    queryFn: () => getTruckById(id),
    enabled: id > 0,
  });
}

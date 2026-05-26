import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { getDriverById, listDrivers } from '@/service/api/functions/drivers';
import type { ListQueryParams } from '@/types/common';

export function listDriversQueryOptions(params?: ListQueryParams) {
  return queryOptions({
    queryKey: queryKeys.drivers.list(params),
    queryFn: () => listDrivers(params),
  });
}

export function driverByIdQueryOptions(id: number) {
  return queryOptions({
    queryKey: queryKeys.drivers.detail(id),
    queryFn: () => getDriverById(id),
    enabled: id > 0,
  });
}

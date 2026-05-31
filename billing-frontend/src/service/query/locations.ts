import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { getLocationById, listLocations } from '@/service/api/functions/locations';
import type { ListQueryParams } from '@/types/common';

export function listLocationsQueryOptions(params?: ListQueryParams) {
  return queryOptions({
    queryKey: queryKeys.locations.list(params),
    queryFn: () => listLocations(params),
  });
}

export function locationByIdQueryOptions(id: number) {
  return queryOptions({
    queryKey: queryKeys.locations.detail(id),
    queryFn: () => getLocationById(id),
    enabled: id > 0,
  });
}

import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { getUnitById, listUnits } from '@/service/api/functions/units';
import type { ListQueryParams } from '@/types/common';

export function listUnitsQueryOptions(params?: ListQueryParams) {
  return queryOptions({
    queryKey: queryKeys.units.list(params),
    queryFn: () => listUnits(params),
  });
}

export function unitByIdQueryOptions(id: number) {
  return queryOptions({
    queryKey: queryKeys.units.detail(id),
    queryFn: () => getUnitById(id),
    enabled: id > 0,
  });
}

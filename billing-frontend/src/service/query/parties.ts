import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { getPartyById, listParties } from '@/service/api/functions/parties';
import type { ListQueryParams } from '@/types/common';

export function listPartiesQueryOptions(params?: ListQueryParams) {
  return queryOptions({
    queryKey: queryKeys.parties.list(params),
    queryFn: () => listParties(params),
  });
}

export function partyByIdQueryOptions(id: number) {
  return queryOptions({
    queryKey: queryKeys.parties.detail(id),
    queryFn: () => getPartyById(id),
    enabled: id > 0,
  });
}

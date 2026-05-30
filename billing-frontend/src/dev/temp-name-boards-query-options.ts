import { queryOptions } from '@tanstack/react-query';
import { paginateTempNameBoards } from '@/dev/temp-name-boards-data';
import type { ListQueryParams } from '@/types/common';

/** In-memory list query for table layout testing (no API). */
export function tempListNameBoardsQueryOptions(params?: ListQueryParams) {
  return queryOptions({
    queryKey: ['dev', 'temp-name-boards', params],
    queryFn: () => Promise.resolve(paginateTempNameBoards(params)),
    staleTime: Number.POSITIVE_INFINITY,
  });
}

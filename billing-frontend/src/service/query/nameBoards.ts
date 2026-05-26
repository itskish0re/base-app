import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { getNameBoardById, listNameBoards } from '@/service/api/functions/nameBoards';
import type { ListQueryParams } from '@/types/common';

export function listNameBoardsQueryOptions(params?: ListQueryParams) {
  return queryOptions({
    queryKey: queryKeys.nameBoards.list(params),
    queryFn: () => listNameBoards(params),
  });
}

export function nameBoardByIdQueryOptions(id: number) {
  return queryOptions({
    queryKey: queryKeys.nameBoards.detail(id),
    queryFn: () => getNameBoardById(id),
    enabled: id > 0,
  });
}

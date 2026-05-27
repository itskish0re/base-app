import { endpoints } from '@/config/endpoints';
import { api } from '@/service/api/client';
import type { ListQueryParams } from '@/types/common';
import type {
  BatchCreateNameBoardsRequest,
  BatchCreateNameBoardsResponse,
  BatchDeleteNameBoardsRequest,
  BatchDeleteNameBoardsResponse,
  BatchToggleNameBoardsRequest,
  BatchToggleNameBoardsResponse,
  BatchUpdateNameBoardsRequest,
  BatchUpdateNameBoardsResponse,
  LookupNameBoardsRequest,
  NameBoardDto,
  NameBoardLookupResponse,
  PagedNameBoardsResponse,
} from '@/types/entity';

export async function listNameBoards(
  params?: ListQueryParams,
): Promise<PagedNameBoardsResponse> {
  const { data } = await api.get<PagedNameBoardsResponse>(endpoints.nameBoards.list(), { params });
  return data;
}

export async function getNameBoardById(id: number): Promise<NameBoardDto> {
  const { data } = await api.get<NameBoardDto>(endpoints.nameBoards.byId(id));
  return data;
}

export async function lookupNameBoards(
  body: LookupNameBoardsRequest,
): Promise<NameBoardLookupResponse> {
  const { data } = await api.post<NameBoardLookupResponse>(endpoints.nameBoards.lookup(), body);
  return data;
}

export async function createNameBoards(
  body: BatchCreateNameBoardsRequest,
): Promise<BatchCreateNameBoardsResponse> {
  const { data } = await api.post<BatchCreateNameBoardsResponse>(endpoints.nameBoards.create(), body);
  return data;
}

export async function updateNameBoards(
  body: BatchUpdateNameBoardsRequest,
): Promise<BatchUpdateNameBoardsResponse> {
  const { data } = await api.post<BatchUpdateNameBoardsResponse>(endpoints.nameBoards.update(), body);
  return data;
}

export async function deleteNameBoards(
  body: BatchDeleteNameBoardsRequest,
): Promise<BatchDeleteNameBoardsResponse> {
  const { data } = await api.post<BatchDeleteNameBoardsResponse>(endpoints.nameBoards.delete(), body);
  return data;
}

export async function toggleNameBoards(
  body: BatchToggleNameBoardsRequest,
): Promise<BatchToggleNameBoardsResponse> {
  const { data } = await api.post<BatchToggleNameBoardsResponse>(endpoints.nameBoards.toggle(), body);
  return data;
}

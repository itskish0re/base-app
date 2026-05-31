import { endpoints } from '@/config/endpoints';
import { api } from '@/service/api/client';
import type { ListQueryParams } from '@/types/common';
import type {
  BatchCreatePartiesRequest,
  BatchCreatePartiesResponse,
  BatchDeletePartiesRequest,
  BatchDeletePartiesResponse,
  BatchTogglePartiesRequest,
  BatchTogglePartiesResponse,
  BatchUpdatePartiesRequest,
  BatchUpdatePartiesResponse,
  LookupPartiesRequest,
  PartyDto,
  PartyLookupResponse,
  PagedPartiesResponse,
} from '@/types/entity';

export async function listParties(
  params?: ListQueryParams,
): Promise<PagedPartiesResponse> {
  const { data } = await api.get<PagedPartiesResponse>(endpoints.parties.list(), { params });
  return data;
}

export async function getPartyById(id: number): Promise<PartyDto> {
  const { data } = await api.get<PartyDto>(endpoints.parties.byId(id));
  return data;
}

export async function lookupParties(
  body: LookupPartiesRequest,
): Promise<PartyLookupResponse> {
  const { data } = await api.post<PartyLookupResponse>(endpoints.parties.lookup(), body);
  return data;
}

export async function createParties(
  body: BatchCreatePartiesRequest,
): Promise<BatchCreatePartiesResponse> {
  const { data } = await api.post<BatchCreatePartiesResponse>(endpoints.parties.create(), body);
  return data;
}

export async function updateParties(
  body: BatchUpdatePartiesRequest,
): Promise<BatchUpdatePartiesResponse> {
  const { data } = await api.post<BatchUpdatePartiesResponse>(endpoints.parties.update(), body);
  return data;
}

export async function deleteParties(
  body: BatchDeletePartiesRequest,
): Promise<BatchDeletePartiesResponse> {
  const { data } = await api.post<BatchDeletePartiesResponse>(endpoints.parties.delete(), body);
  return data;
}

export async function toggleParties(
  body: BatchTogglePartiesRequest,
): Promise<BatchTogglePartiesResponse> {
  const { data } = await api.post<BatchTogglePartiesResponse>(endpoints.parties.toggle(), body);
  return data;
}

import { endpoints } from '@/config/endpoints';
import { api } from '@/service/api/client';
import type { ListQueryParams } from '@/types/common';
import type {
  BatchCreateUnitsRequest,
  BatchCreateUnitsResponse,
  BatchDeleteUnitsRequest,
  BatchDeleteUnitsResponse,
  BatchToggleUnitsRequest,
  BatchToggleUnitsResponse,
  BatchUpdateUnitsRequest,
  BatchUpdateUnitsResponse,
  LookupUnitsRequest,
  UnitDto,
  UnitLookupResponse,
  PagedUnitsResponse,
} from '@/types/entity';

export async function listUnits(
  params?: ListQueryParams,
): Promise<PagedUnitsResponse> {
  const { data } = await api.get<PagedUnitsResponse>(endpoints.units.list(), { params });
  return data;
}

export async function getUnitById(id: number): Promise<UnitDto> {
  const { data } = await api.get<UnitDto>(endpoints.units.byId(id));
  return data;
}

export async function lookupUnits(
  body: LookupUnitsRequest,
): Promise<UnitLookupResponse> {
  const { data } = await api.post<UnitLookupResponse>(endpoints.units.lookup(), body);
  return data;
}

export async function createUnits(
  body: BatchCreateUnitsRequest,
): Promise<BatchCreateUnitsResponse> {
  const { data } = await api.post<BatchCreateUnitsResponse>(endpoints.units.create(), body);
  return data;
}

export async function updateUnits(
  body: BatchUpdateUnitsRequest,
): Promise<BatchUpdateUnitsResponse> {
  const { data } = await api.post<BatchUpdateUnitsResponse>(endpoints.units.update(), body);
  return data;
}

export async function deleteUnits(
  body: BatchDeleteUnitsRequest,
): Promise<BatchDeleteUnitsResponse> {
  const { data } = await api.post<BatchDeleteUnitsResponse>(endpoints.units.delete(), body);
  return data;
}

export async function toggleUnits(
  body: BatchToggleUnitsRequest,
): Promise<BatchToggleUnitsResponse> {
  const { data } = await api.post<BatchToggleUnitsResponse>(endpoints.units.toggle(), body);
  return data;
}

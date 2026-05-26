import { endpoints } from '@/config/endpoints';
import { api } from '@/service/api/client';
import type { ListQueryParams } from '@/types/common';
import type {
  BatchCreateTrucksRequest,
  BatchCreateTrucksResponse,
  BatchDeleteTrucksRequest,
  BatchDeleteTrucksResponse,
  BatchToggleTrucksRequest,
  BatchToggleTrucksResponse,
  BatchUpdateTrucksRequest,
  BatchUpdateTrucksResponse,
  LookupTrucksRequest,
  PagedTrucksResponse,
  TruckDto,
  TruckLookupResponse,
} from '@/types/truck';

export async function listTrucks(params?: ListQueryParams): Promise<PagedTrucksResponse> {
  const { data } = await api.get<PagedTrucksResponse>(endpoints.trucks.list(), { params });
  return data;
}

export async function getTruckById(id: number): Promise<TruckDto> {
  const { data } = await api.get<TruckDto>(endpoints.trucks.byId(id));
  return data;
}

export async function lookupTrucks(body: LookupTrucksRequest): Promise<TruckLookupResponse> {
  const { data } = await api.post<TruckLookupResponse>(endpoints.trucks.lookup(), body);
  return data;
}

export async function createTrucks(body: BatchCreateTrucksRequest): Promise<BatchCreateTrucksResponse> {
  const { data } = await api.post<BatchCreateTrucksResponse>(endpoints.trucks.create(), body);
  return data;
}

export async function updateTrucks(body: BatchUpdateTrucksRequest): Promise<BatchUpdateTrucksResponse> {
  const { data } = await api.post<BatchUpdateTrucksResponse>(endpoints.trucks.update(), body);
  return data;
}

export async function deleteTrucks(body: BatchDeleteTrucksRequest): Promise<BatchDeleteTrucksResponse> {
  const { data } = await api.post<BatchDeleteTrucksResponse>(endpoints.trucks.delete(), body);
  return data;
}

export async function toggleTrucks(body: BatchToggleTrucksRequest): Promise<BatchToggleTrucksResponse> {
  const { data } = await api.post<BatchToggleTrucksResponse>(endpoints.trucks.toggle(), body);
  return data;
}

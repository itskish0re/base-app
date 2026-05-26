import { endpoints } from '@/config/endpoints';
import { api } from '@/service/api/client';
import type { ListQueryParams } from '@/types/common';
import type {
  BatchCreateDriversRequest,
  BatchCreateDriversResponse,
  BatchDeleteDriversRequest,
  BatchDeleteDriversResponse,
  BatchToggleDriversRequest,
  BatchToggleDriversResponse,
  BatchUpdateDriversRequest,
  BatchUpdateDriversResponse,
  DriverDto,
  DriverLookupResponse,
  LookupDriversRequest,
  PagedDriversResponse,
} from '@/types/driver';

export async function listDrivers(params?: ListQueryParams): Promise<PagedDriversResponse> {
  const { data } = await api.get<PagedDriversResponse>(endpoints.drivers.list(), { params });
  return data;
}

export async function getDriverById(id: number): Promise<DriverDto> {
  const { data } = await api.get<DriverDto>(endpoints.drivers.byId(id));
  return data;
}

export async function lookupDrivers(body: LookupDriversRequest): Promise<DriverLookupResponse> {
  const { data } = await api.post<DriverLookupResponse>(endpoints.drivers.lookup(), body);
  return data;
}

export async function createDrivers(
  body: BatchCreateDriversRequest,
): Promise<BatchCreateDriversResponse> {
  const { data } = await api.post<BatchCreateDriversResponse>(endpoints.drivers.create(), body);
  return data;
}

export async function updateDrivers(
  body: BatchUpdateDriversRequest,
): Promise<BatchUpdateDriversResponse> {
  const { data } = await api.post<BatchUpdateDriversResponse>(endpoints.drivers.update(), body);
  return data;
}

export async function deleteDrivers(
  body: BatchDeleteDriversRequest,
): Promise<BatchDeleteDriversResponse> {
  const { data } = await api.post<BatchDeleteDriversResponse>(endpoints.drivers.delete(), body);
  return data;
}

export async function toggleDrivers(
  body: BatchToggleDriversRequest,
): Promise<BatchToggleDriversResponse> {
  const { data } = await api.post<BatchToggleDriversResponse>(endpoints.drivers.toggle(), body);
  return data;
}

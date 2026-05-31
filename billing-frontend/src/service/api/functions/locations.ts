import { endpoints } from '@/config/endpoints';
import { api } from '@/service/api/client';
import type { ListQueryParams } from '@/types/common';
import type {
  BatchCreateLocationsRequest,
  BatchCreateLocationsResponse,
  BatchDeleteLocationsRequest,
  BatchDeleteLocationsResponse,
  BatchToggleLocationsRequest,
  BatchToggleLocationsResponse,
  BatchUpdateLocationsRequest,
  BatchUpdateLocationsResponse,
  LookupLocationsRequest,
  LocationDto,
  LocationLookupResponse,
  PagedLocationsResponse,
} from '@/types/entity';

export async function listLocations(
  params?: ListQueryParams,
): Promise<PagedLocationsResponse> {
  const { data } = await api.get<PagedLocationsResponse>(endpoints.locations.list(), { params });
  return data;
}

export async function getLocationById(id: number): Promise<LocationDto> {
  const { data } = await api.get<LocationDto>(endpoints.locations.byId(id));
  return data;
}

export async function lookupLocations(
  body: LookupLocationsRequest,
): Promise<LocationLookupResponse> {
  const { data } = await api.post<LocationLookupResponse>(endpoints.locations.lookup(), body);
  return data;
}

export async function createLocations(
  body: BatchCreateLocationsRequest,
): Promise<BatchCreateLocationsResponse> {
  const { data } = await api.post<BatchCreateLocationsResponse>(endpoints.locations.create(), body);
  return data;
}

export async function updateLocations(
  body: BatchUpdateLocationsRequest,
): Promise<BatchUpdateLocationsResponse> {
  const { data } = await api.post<BatchUpdateLocationsResponse>(endpoints.locations.update(), body);
  return data;
}

export async function deleteLocations(
  body: BatchDeleteLocationsRequest,
): Promise<BatchDeleteLocationsResponse> {
  const { data } = await api.post<BatchDeleteLocationsResponse>(endpoints.locations.delete(), body);
  return data;
}

export async function toggleLocations(
  body: BatchToggleLocationsRequest,
): Promise<BatchToggleLocationsResponse> {
  const { data } = await api.post<BatchToggleLocationsResponse>(endpoints.locations.toggle(), body);
  return data;
}

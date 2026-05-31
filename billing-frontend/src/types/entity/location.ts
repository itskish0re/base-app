import type {
  BatchDeleteResponse,
  BatchItemFailure,
  LookupFieldMapping,
  LookupResponse,
  PagedResponse,
} from '@/types/common';

export interface LocationDto {
  locationId: number;
  code: string;
  name: string;
  isEnabled: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PagedLocationsResponse = PagedResponse<LocationDto>;

export type BatchLocationItemFailure = BatchItemFailure;

export interface BatchCreateLocationsResponse {
  created: LocationDto[];
  failures: BatchLocationItemFailure[];
}

export interface BatchUpdateLocationsResponse {
  updated: LocationDto[];
  failures: BatchLocationItemFailure[];
}

export type BatchDeleteLocationsResponse = BatchDeleteResponse;

export interface BatchToggleLocationsResponse {
  updated: LocationDto[];
  failures: BatchLocationItemFailure[];
}

export interface CreateLocationItemRequest {
  name: string;
  code: string;
}

export interface UpdateLocationItemRequest {
  locationId: number;
  name: string;
  code: string;
  isEnabled?: boolean;
  isActive?: boolean;
}

export interface ToggleLocationItemRequest {
  locationId: number;
  isEnabled: boolean;
}

export interface BatchCreateLocationsRequest {
  items: CreateLocationItemRequest[];
}

export interface BatchUpdateLocationsRequest {
  items: UpdateLocationItemRequest[];
}

export interface BatchDeleteLocationsRequest {
  ids: number[];
}

export interface BatchToggleLocationsRequest {
  items: ToggleLocationItemRequest[];
}

export type LocationLookupFieldMapping = LookupFieldMapping;

export interface LookupLocationsRequest {
  value: string;
  label: string;
  fields?: LocationLookupFieldMapping[] | null;
}

export type LocationLookupResponse = LookupResponse;

import type {
  BatchDeleteResponse,
  BatchItemFailure,
  LookupFieldMapping,
  LookupResponse,
  PagedResponse,
} from '@/types/common';

export interface DriverDto {
  driverId: number;
  name: string;
  mobile: string;
  truckId: number;
  truckNumber: string | null;
  isEnabled: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PagedDriversResponse = PagedResponse<DriverDto>;

export type BatchDriverItemFailure = BatchItemFailure;

export interface BatchCreateDriversResponse {
  created: DriverDto[];
  failures: BatchDriverItemFailure[];
}

export interface BatchUpdateDriversResponse {
  updated: DriverDto[];
  failures: BatchDriverItemFailure[];
}

export type BatchDeleteDriversResponse = BatchDeleteResponse;

export interface BatchToggleDriversResponse {
  updated: DriverDto[];
  failures: BatchDriverItemFailure[];
}

export interface CreateDriverItemRequest {
  name: string;
  mobile: string;
  truckId: number;
}

export interface UpdateDriverItemRequest {
  driverId: number;
  name: string;
  mobile: string;
  truckId: number;
  isEnabled?: boolean;
  isActive?: boolean;
}

export interface ToggleDriverItemRequest {
  driverId: number;
  isEnabled: boolean;
}

export interface BatchCreateDriversRequest {
  items: CreateDriverItemRequest[];
}

export interface BatchUpdateDriversRequest {
  items: UpdateDriverItemRequest[];
}

export interface BatchDeleteDriversRequest {
  ids: number[];
}

export interface BatchToggleDriversRequest {
  items: ToggleDriverItemRequest[];
}

export type DriverLookupFieldMapping = LookupFieldMapping;

export interface LookupDriversRequest {
  value: string;
  label: string;
  fields?: DriverLookupFieldMapping[] | null;
}

export type DriverLookupResponse = LookupResponse;

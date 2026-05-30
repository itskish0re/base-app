import type {
  BatchDeleteResponse,
  BatchItemFailure,
  LookupFieldMapping,
  LookupResponse,
  PagedResponse,
} from '@/types/common';

export interface TruckDto {
  truckId: number;
  truckNumber: string;
  nameBoardId: number;
  nameBoardCode: string | null;
  nameBoardName: string | null;
  isEnabled: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PagedTrucksResponse = PagedResponse<TruckDto>;

export type BatchTruckItemFailure = BatchItemFailure;

export interface BatchCreateTrucksResponse {
  created: TruckDto[];
  failures: BatchTruckItemFailure[];
}

export interface BatchUpdateTrucksResponse {
  updated: TruckDto[];
  failures: BatchTruckItemFailure[];
}

export type BatchDeleteTrucksResponse = BatchDeleteResponse;

export interface BatchToggleTrucksResponse {
  updated: TruckDto[];
  failures: BatchTruckItemFailure[];
}

export interface CreateTruckItemRequest {
  truckNumber: string;
  nameBoardId: number;
}

export interface UpdateTruckItemRequest {
  truckId: number;
  truckNumber: string;
  nameBoardId: number;
  isEnabled?: boolean;
  isActive?: boolean;
}

export interface ToggleTruckItemRequest {
  truckId: number;
  isEnabled: boolean;
}

export interface BatchCreateTrucksRequest {
  items: CreateTruckItemRequest[];
}

export interface BatchUpdateTrucksRequest {
  items: UpdateTruckItemRequest[];
}

export interface BatchDeleteTrucksRequest {
  ids: number[];
}

export interface BatchToggleTrucksRequest {
  items: ToggleTruckItemRequest[];
}

export type TruckLookupFieldMapping = LookupFieldMapping;

export interface LookupTrucksRequest {
  value: string;
  label: string;
  fields?: TruckLookupFieldMapping[] | null;
}

export type TruckLookupResponse = LookupResponse;

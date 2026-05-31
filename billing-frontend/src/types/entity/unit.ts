import type {
  BatchDeleteResponse,
  BatchItemFailure,
  LookupFieldMapping,
  LookupResponse,
  PagedResponse,
} from '@/types/common';

export interface UnitDto {
  unitId: number;
  code: string;
  name: string;
  isFixed: boolean;
  isEnabled: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PagedUnitsResponse = PagedResponse<UnitDto>;

export type BatchUnitItemFailure = BatchItemFailure;

export interface BatchCreateUnitsResponse {
  created: UnitDto[];
  failures: BatchUnitItemFailure[];
}

export interface BatchUpdateUnitsResponse {
  updated: UnitDto[];
  failures: BatchUnitItemFailure[];
}

export type BatchDeleteUnitsResponse = BatchDeleteResponse;

export interface BatchToggleUnitsResponse {
  updated: UnitDto[];
  failures: BatchUnitItemFailure[];
}

export interface CreateUnitItemRequest {
  name: string;
  code: string;
  isFixed?: boolean;
}

export interface UpdateUnitItemRequest {
  unitId: number;
  name: string;
  code: string;
  isFixed: boolean;
  isEnabled?: boolean;
  isActive?: boolean;
}

export interface ToggleUnitItemRequest {
  unitId: number;
  isEnabled: boolean;
}

export interface BatchCreateUnitsRequest {
  items: CreateUnitItemRequest[];
}

export interface BatchUpdateUnitsRequest {
  items: UpdateUnitItemRequest[];
}

export interface BatchDeleteUnitsRequest {
  ids: number[];
}

export interface BatchToggleUnitsRequest {
  items: ToggleUnitItemRequest[];
}

export type UnitLookupFieldMapping = LookupFieldMapping;

export interface LookupUnitsRequest {
  value: string;
  label: string;
  fields?: UnitLookupFieldMapping[] | null;
}

export type UnitLookupResponse = LookupResponse;

import type {
  BatchDeleteResponse,
  BatchItemFailure,
  LookupFieldMapping,
  LookupResponse,
  PagedResponse,
} from '@/types/common';

export interface FinancialYearDto {
  financialYearId: number;
  code: string;
  name: string;
  isEnabled: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PagedFinancialYearsResponse = PagedResponse<FinancialYearDto>;

export type BatchFinancialYearItemFailure = BatchItemFailure;

export interface BatchCreateFinancialYearsResponse {
  created: FinancialYearDto[];
  failures: BatchFinancialYearItemFailure[];
}

export interface BatchUpdateFinancialYearsResponse {
  updated: FinancialYearDto[];
  failures: BatchFinancialYearItemFailure[];
}

export type BatchDeleteFinancialYearsResponse = BatchDeleteResponse;

export interface BatchToggleFinancialYearsResponse {
  updated: FinancialYearDto[];
  failures: BatchFinancialYearItemFailure[];
}

export interface CreateFinancialYearItemRequest {
  code: string;
}

export interface UpdateFinancialYearItemRequest {
  financialYearId: number;
  code: string;
  isEnabled?: boolean;
  isActive?: boolean;
}

export interface ToggleFinancialYearItemRequest {
  financialYearId: number;
  isEnabled: boolean;
}

export interface BatchCreateFinancialYearsRequest {
  items: CreateFinancialYearItemRequest[];
}

export interface BatchUpdateFinancialYearsRequest {
  items: UpdateFinancialYearItemRequest[];
}

export interface BatchDeleteFinancialYearsRequest {
  ids: number[];
}

export interface BatchToggleFinancialYearsRequest {
  items: ToggleFinancialYearItemRequest[];
}

export type FinancialYearLookupFieldMapping = LookupFieldMapping;

export interface LookupFinancialYearsRequest {
  value: string;
  label: string;
  fields?: FinancialYearLookupFieldMapping[] | null;
}

export type FinancialYearLookupResponse = LookupResponse;

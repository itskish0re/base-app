import { endpoints } from '@/config/endpoints';
import { api } from '@/service/api/client';
import type { ListQueryParams } from '@/types/common';
import type {
  BatchCreateFinancialYearsRequest,
  BatchCreateFinancialYearsResponse,
  BatchDeleteFinancialYearsRequest,
  BatchDeleteFinancialYearsResponse,
  BatchToggleFinancialYearsRequest,
  BatchToggleFinancialYearsResponse,
  BatchUpdateFinancialYearsRequest,
  BatchUpdateFinancialYearsResponse,
  FinancialYearDto,
  FinancialYearLookupResponse,
  LookupFinancialYearsRequest,
  PagedFinancialYearsResponse,
} from '@/types/entity';

export async function listFinancialYears(
  params?: ListQueryParams,
): Promise<PagedFinancialYearsResponse> {
  const { data } = await api.get<PagedFinancialYearsResponse>(endpoints.financialYears.list(), {
    params,
  });
  return data;
}

export async function getFinancialYearById(id: number): Promise<FinancialYearDto> {
  const { data } = await api.get<FinancialYearDto>(endpoints.financialYears.byId(id));
  return data;
}

export async function lookupFinancialYears(
  body: LookupFinancialYearsRequest,
): Promise<FinancialYearLookupResponse> {
  const { data } = await api.post<FinancialYearLookupResponse>(
    endpoints.financialYears.lookup(),
    body,
  );
  return data;
}

export async function createFinancialYears(
  body: BatchCreateFinancialYearsRequest,
): Promise<BatchCreateFinancialYearsResponse> {
  const { data } = await api.post<BatchCreateFinancialYearsResponse>(
    endpoints.financialYears.create(),
    body,
  );
  return data;
}

export async function updateFinancialYears(
  body: BatchUpdateFinancialYearsRequest,
): Promise<BatchUpdateFinancialYearsResponse> {
  const { data } = await api.post<BatchUpdateFinancialYearsResponse>(
    endpoints.financialYears.update(),
    body,
  );
  return data;
}

export async function deleteFinancialYears(
  body: BatchDeleteFinancialYearsRequest,
): Promise<BatchDeleteFinancialYearsResponse> {
  const { data } = await api.post<BatchDeleteFinancialYearsResponse>(
    endpoints.financialYears.delete(),
    body,
  );
  return data;
}

export async function toggleFinancialYears(
  body: BatchToggleFinancialYearsRequest,
): Promise<BatchToggleFinancialYearsResponse> {
  const { data } = await api.post<BatchToggleFinancialYearsResponse>(
    endpoints.financialYears.toggle(),
    body,
  );
  return data;
}

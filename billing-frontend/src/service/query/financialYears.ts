import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import {
  getFinancialYearById,
  listFinancialYears,
} from '@/service/api/functions/financialYears';
import type { ListQueryParams } from '@/types/common';

export function listFinancialYearsQueryOptions(params?: ListQueryParams) {
  return queryOptions({
    queryKey: queryKeys.financialYears.list(params),
    queryFn: () => listFinancialYears(params),
  });
}

export function financialYearByIdQueryOptions(id: number) {
  return queryOptions({
    queryKey: queryKeys.financialYears.detail(id),
    queryFn: () => getFinancialYearById(id),
    enabled: id > 0,
  });
}

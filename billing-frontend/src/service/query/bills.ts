import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import {
  FINANCIAL_YEAR_SCOPED_QUERY_META,
  withFinancialYearQueryKey,
} from '@/lib/financialYearQueries';
import { getBillById, getNextBillNumber, listBills } from '@/service/api/functions/bills';
import type { ListQueryParams } from '@/types/common';

export function listBillsQueryOptions(params?: ListQueryParams) {
  return queryOptions({
    queryKey: queryKeys.bills.list(params),
    queryFn: () => listBills(params),
  });
}

export function billByIdQueryOptions(id: number) {
  return queryOptions({
    queryKey: queryKeys.bills.detail(id),
    queryFn: () => getBillById(id),
    enabled: id > 0,
  });
}

export function nextBillNumberQueryOptions(financialYearId: number | null) {
  const baseQueryKey = [...queryKeys.bills.all, 'next-number'] as const;

  return queryOptions({
    queryKey: withFinancialYearQueryKey(baseQueryKey, financialYearId, true),
    queryFn: () => getNextBillNumber(),
    meta: FINANCIAL_YEAR_SCOPED_QUERY_META,
    enabled: financialYearId != null,
  });
}

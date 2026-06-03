import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
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

export function nextBillNumberQueryOptions() {
  return queryOptions({
    queryKey: [...queryKeys.bills.all, 'next-number'] as const,
    queryFn: () => getNextBillNumber(),
  });
}

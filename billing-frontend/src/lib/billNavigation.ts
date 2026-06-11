import type { QueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { withFinancialYearQueryKey } from '@/lib/financialYearQueries';
import { incrementBillNumber } from '@/lib/billNumberNavigation';
import { getNextBillNumber, listBills } from '@/service/api/functions/bills';
import { billFormDraftActions } from '@/store/global/billFormDraftSlice';
import type { AppDispatch } from '@/store/store';

export function nextBillNumberQueryKey(financialYearId: number) {
  return withFinancialYearQueryKey(
    [...queryKeys.bills.all, 'next-number'] as const,
    financialYearId,
    true,
  );
}

/** After save, fetch the FY next bill number and update store + query cache. */
export async function syncBillNavigationAfterSave(
  dispatch: AppDispatch,
  queryClient: QueryClient,
  financialYearId: number,
  savedBill: { billId: number; billNumber: string },
): Promise<string> {
  let nextBillNumber: string;

  try {
    nextBillNumber = (await getNextBillNumber()).billNumber;
  } catch {
    nextBillNumber = incrementBillNumber(savedBill.billNumber);
  }

  dispatch(
    billFormDraftActions.setBillNavigation({
      financialYearId,
      lastBillId: savedBill.billId,
      lastBillNumber: savedBill.billNumber,
      nextBillNumber,
    }),
  );

  queryClient.setQueryData(nextBillNumberQueryKey(financialYearId), {
    billNumber: nextBillNumber,
  });

  return nextBillNumber;
}

export async function findBillIdByNumber(billNumber: string): Promise<number | null> {
  const trimmed = billNumber.trim();
  if (!trimmed) {
    return null;
  }

  const response = await listBills({
    filter: trimmed,
    page: 1,
    pageSize: 20,
  });

  const match = response.items.find((item) => item.billNumber === trimmed);
  return match?.billId ?? null;
}

export async function findLatestBill(): Promise<{ billId: number; billNumber: string } | null> {
  const response = await listBills({
    orderBy: 'billId desc',
    page: 1,
    pageSize: 1,
  });

  const latest = response.items[0];
  if (!latest) {
    return null;
  }

  return {
    billId: latest.billId,
    billNumber: latest.billNumber,
  };
}

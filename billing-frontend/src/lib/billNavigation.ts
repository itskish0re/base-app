import { listBills } from '@/service/api/functions/bills';

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

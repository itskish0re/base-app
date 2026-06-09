/** Key/value charge line in bills.others (jsonb array). */
export type BillOtherItem = {
  key: string;
  value: number | '';
};

export function sumBillOtherItems(items: BillOtherItem[]): number {
  return items.reduce((sum, item) => {
    const n = item.value === '' ? 0 : Number(item.value);
    return sum + (Number.isFinite(n) ? n : 0);
  }, 0);
}

export function createEmptyBillOtherItem(): BillOtherItem {
  return { key: '', value: 0 };
}

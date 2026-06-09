import { formatBillFormAmount, sumLoadField, toFormNumber } from '@/lib/billForm';
import type { BillFormValues } from '@/types/billForm';

type BillChargesSummaryProps = {
  values: BillFormValues;
};

export function BillChargesSummary({ values }: BillChargesSummaryProps) {
  const rows = [
    { key: 'advance', label: 'Advance', value: sumLoadField(values.loads, 'advance') },
    { key: 'commission', label: 'Commission', value: toFormNumber(values.commission) ?? 0 },
    { key: 'balance', label: 'Balance', value: sumLoadField(values.loads, 'balance') },
  ] as const;

  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <table className="w-full min-w-[12rem] border-collapse text-sm">
        <caption className="sr-only">Load payment summary</caption>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b last:border-b-0">
              <th className="w-[45%] border-r px-3 py-2.5 text-left font-medium">{row.label}</th>
              <td className="px-3 py-2.5 text-right tabular-nums">{formatBillFormAmount(row.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

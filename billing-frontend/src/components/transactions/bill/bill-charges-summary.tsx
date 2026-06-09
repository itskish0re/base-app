import { buildBillAdvanceSummary } from '@/lib/billPreview';
import { formatBillFormAmount, toFormNumber } from '@/lib/billForm';
import type { BillFormValues } from '@/types/billForm';

type BillChargesSummaryProps = {
  values: BillFormValues;
};

export function BillChargesSummary({ values }: BillChargesSummaryProps) {
  const loads = values.loads.map((line) => ({
    advance: toFormNumber(line.advance),
    balance: toFormNumber(line.balance),
  }));

  const summary = buildBillAdvanceSummary(loads, toFormNumber(values.total));
  if (!summary) {
    return null;
  }

  const rows = [
    { key: 'advance', label: 'Advance', value: summary.advance },
    { key: 'commission', label: 'Commission', value: summary.commission },
    { key: 'balance', label: 'Balance', value: summary.balance },
  ] as const;

  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">Advance Summary</p>
      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full min-w-[12rem] border-collapse text-sm">
          <caption className="sr-only">Advance summary</caption>
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
    </div>
  );
}

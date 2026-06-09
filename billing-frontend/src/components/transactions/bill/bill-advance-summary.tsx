import {
  formatBillFormAmount,
  formatBillFormCurrency,
  sumLoadAdvances,
  toFormNumber,
} from '@/lib/billForm';
import type { BillFormValues } from '@/types/billForm';

type BillAdvanceSummaryProps = {
  values: BillFormValues;
};

export function BillAdvanceSummary({ values }: BillAdvanceSummaryProps) {
  const totalAdvance = sumLoadAdvances(values.loads);
  const grandTotal = toFormNumber(values.total) ?? 0;
  const netBalance = totalAdvance - grandTotal;

  return (
    <div className="space-y-3">
      <div className="px-2 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Total Advance</span>
        <span className="font-mono text-sm tabular-nums">{formatBillFormAmount(totalAdvance)}</span>
      </div>
      <div className="px-2 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Grand Total</span>
        <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
          {formatBillFormCurrency(grandTotal)}
        </span>
      </div>
      <div className="mt-2 p-2 flex items-center justify-between rounded-md bg-muted/60">
        <span className="text-xs font-semibold text-foreground">Net Balance</span>
        <span className="font-mono text-sm font-bold tabular-nums text-primary">
          {formatBillFormCurrency(netBalance)}
        </span>
      </div>
    </div>
  );
}

import {
  formatBillFormCurrency,
  sumLoadAdvances,
  sumLoadTopay,
  toFormNumber,
} from '@/lib/billForm';
import type { BillFormValues } from '@/types/billForm';

type BillChargesSummaryProps = {
  values: BillFormValues;
};

export function BillChargesSummary({ values }: BillChargesSummaryProps) {
  const totalAdvance = sumLoadAdvances(values.loads);
  const totalTopay = sumLoadTopay(values.loads);
  const netBalance = toFormNumber(values.total) ?? 0;

  return (
    <div className="space-y-3 border-t border-dashed border-border pt-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Total Advance</span>
        <span className="font-mono text-sm tabular-nums">{formatBillFormCurrency(totalAdvance)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Total To Pay</span>
        <span className="font-mono text-sm tabular-nums">{formatBillFormCurrency(totalTopay)}</span>
      </div>
      <div className="mt-2 flex items-center justify-between rounded-md bg-muted/60 p-2">
        <span className="text-xs font-semibold text-foreground">Net Balance</span>
        <span className="font-mono text-sm font-bold tabular-nums text-primary">
          {formatBillFormCurrency(netBalance)}
        </span>
      </div>
    </div>
  );
}

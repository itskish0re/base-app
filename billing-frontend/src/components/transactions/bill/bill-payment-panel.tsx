import { EntityFormRequiredMark } from '@/components/derived/entity-form/ef-form-ui';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { BILL_PAY_BY_OPTIONS, type BillPayBy } from '@/types/entity/bill';
import type { BillFormValues } from '@/types/billForm';

type BillPaymentPanelProps = {
  values: BillFormValues;
  onChange: (partial: Partial<BillFormValues>) => void;
};

export function BillPaymentPanel({ values, onChange }: BillPaymentPanelProps) {
  const isUpi = values.payBy === 'upi';

  const selectPayBy = (payBy: BillPayBy) => {
    if (payBy === 'upi') {
      onChange({ payBy });
      return;
    }

    onChange({ payBy, paidName: '', paidMobile: '' });
  };

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="p-3">
        <div
          className="inline-flex w-full rounded-lg border bg-muted/60 p-1"
          role="group"
          aria-label="Payment method"
        >
          {BILL_PAY_BY_OPTIONS.map((option) => {
            const selected = values.payBy === option.value;

            return (
              <button
                key={option.value}
                type="button"
                className={cn(
                  'flex-1 rounded-md px-2 py-2 text-xs font-semibold uppercase tracking-wide transition-all sm:text-sm',
                  selected
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                aria-pressed={selected}
                onClick={() => selectPayBy(option.value)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {isUpi ? (
        <table className="w-full border-collapse border-t text-sm">
          <tbody>
            <tr className="border-b">
              <th className="w-[38%] border-r px-3 py-2.5 text-left align-middle font-medium sm:w-[34%]">
                <Label htmlFor="bill-paid-name" className="font-medium">
                  Paid name
                  <EntityFormRequiredMark />
                </Label>
              </th>
              <td className="px-2 py-2">
                <Input
                  id="bill-paid-name"
                  value={values.paidName}
                  autoComplete="name"
                  className="h-9 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
                  onChange={(e) => onChange({ paidName: e.target.value })}
                />
              </td>
            </tr>
            <tr>
              <th className="border-r px-3 py-2.5 text-left align-middle font-medium">
                <Label htmlFor="bill-paid-mobile" className="font-medium">
                  Paid mobile
                  <EntityFormRequiredMark />
                </Label>
              </th>
              <td className="px-2 py-2">
                <Input
                  id="bill-paid-mobile"
                  value={values.paidMobile}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  className="h-9 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
                  onChange={(e) => onChange({ paidMobile: e.target.value })}
                />
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p className="border-t px-3 py-2.5 text-xs text-muted-foreground">
          {values.payBy
            ? 'Name and mobile are only required for UPI.'
            : 'Select how payment was made.'}
        </p>
      )}
    </div>
  );
}

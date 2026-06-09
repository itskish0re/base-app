import { EntityFormRequiredMark } from '@/components/derived/entity-form/ef-form-ui';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { BILL_PAY_BY_OPTIONS, type BillPayBy } from '@/types/entity/bill';
import type { BillFormValues } from '@/types/billForm';

type BillPaymentPanelProps = {
  values: BillFormValues;
  onChange: (partial: Partial<BillFormValues>) => void;
  embedded?: boolean;
};

export function BillPaymentPanel({ values, onChange, embedded = false }: BillPaymentPanelProps) {
  const isUpi = values.payBy === 'upi';

  const selectPayBy = (payBy: BillPayBy) => {
    if (payBy === 'upi') {
      onChange({ payBy });
      return;
    }

    onChange({ payBy, paidName: '', paidMobile: '' });
  };

  return (
    <div className={cn(!embedded && 'overflow-hidden rounded-lg border bg-card')}>
      <div className={cn(embedded ? 'space-y-2' : 'p-3')}>
        <Label className="text-xs font-medium text-muted-foreground">Payment Mode</Label>
        <div className="flex rounded-md bg-muted p-1" role="group" aria-label="Payment method">
          {BILL_PAY_BY_OPTIONS.map((option) => {
            const selected = values.payBy === option.value;

            return (
              <button
                key={option.value}
                type="button"
                className={cn(
                  'flex-1 rounded-md px-2 py-2 text-xs font-semibold uppercase tracking-wide transition-all sm:text-sm',
                  selected
                    ? 'bg-card text-foreground shadow-sm'
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
        <div className={cn('space-y-3', embedded ? 'pt-1' : 'border-t px-3 py-3')}>
          <div className="space-y-1.5">
            <Label htmlFor="bill-paid-name" className="text-xs font-medium text-muted-foreground">
              Paid name
              <EntityFormRequiredMark />
            </Label>
            <Input
              id="bill-paid-name"
              value={values.paidName}
              autoComplete="name"
              className="h-9"
              onChange={(e) => onChange({ paidName: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bill-paid-mobile" className="text-xs font-medium text-muted-foreground">
              Paid mobile
              <EntityFormRequiredMark />
            </Label>
            <Input
              id="bill-paid-mobile"
              value={values.paidMobile}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              className="h-9"
              onChange={(e) => onChange({ paidMobile: e.target.value })}
            />
          </div>
        </div>
      ) : (
        <p className={cn('text-xs text-muted-foreground', embedded ? 'pt-1' : 'border-t px-3 py-2.5')}>
          {values.payBy
            ? 'Name and mobile are only required for UPI.'
            : 'Select how payment was made.'}
        </p>
      )}
    </div>
  );
}

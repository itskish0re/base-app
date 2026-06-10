import { Plus, Trash2 } from 'lucide-react';
import { EntityFormFieldError } from '@/components/derived/entity-form/ef-form-ui';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  BillFormCurrencyAmount,
  BillFormNumericInput,
} from '@/components/transactions/bill/bill-form-ui';
import {
  billFormFieldError,
  formatBillFormCurrency,
  isTruckLoanAllowed,
  toFormNumber,
  type BillFormFieldErrors,
} from '@/lib/billForm';
import { createEmptyBillOtherItem, type BillOtherItem } from '@/types/billOther';
import type { BillFormValues } from '@/types/billForm';

type BillChargesTableProps = {
  values: BillFormValues;
  fieldErrors?: BillFormFieldErrors;
  onNumericChange: (key: keyof BillFormValues, raw: string) => void;
  onTruckLoanChange: (checked: boolean) => void;
  others: BillOtherItem[];
  onOthersChange: (items: BillOtherItem[]) => void;
};

const CHARGE_ROWS = [
  ['totalFreight', 'Total freight', true],
  ['commission', 'Commission', true],
  ['crossing', 'Crossing', false],
  ['officeMamul', 'Office mamul', false],
  ['tapalMamul', 'Tapal mamul', false],
  ['diesel', 'Diesel', false],
  ['handLoan', 'Hand loan', false],
] as const;

export function BillChargesTable({
  values,
  fieldErrors,
  onNumericChange,
  onTruckLoanChange,
  others,
  onOthersChange,
}: BillChargesTableProps) {
  const truckLoanEnabled = isTruckLoanAllowed(values.loads);

  const updateOther = (index: number, patch: Partial<BillOtherItem>) => {
    onOthersChange(others.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const addOther = () => {
    onOthersChange([...others, createEmptyBillOtherItem()]);
  };

  const removeOther = (index: number) => {
    if (others.length <= 1) {
      onOthersChange([createEmptyBillOtherItem()]);
      return;
    }

    onOthersChange(others.filter((_, i) => i !== index));
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[20rem] border-collapse text-sm">
        <caption className="sr-only">Bill charges</caption>
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Description</th>
            <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">Amount (+)</th>
          </tr>
        </thead>
        <tbody>
          {CHARGE_ROWS.map(([key, label, readOnly]) => {
            const error = billFormFieldError(fieldErrors, key);

            return (
              <tr key={key} className="border-b border-border transition-colors hover:bg-muted/20">
                <td className="px-4 py-1.5 font-medium">{label}</td>
                <td className="px-4 py-1.5">
                  {readOnly ? (
                    <BillFormCurrencyAmount
                      value={values[key]}
                      className="ml-auto max-w-[8rem]"
                    />
                  ) : (
                    <div className="ml-auto max-w-[8rem]">
                      <BillFormNumericInput
                        id={`bill-${key}`}
                        value={values[key]}
                        className="h-8 text-right"
                        aria-invalid={error ? true : undefined}
                        onChange={(nextValue) => onNumericChange(key, nextValue === '' ? '' : String(nextValue))}
                      />
                      <EntityFormFieldError message={error} className="mt-1 text-right" />
                    </div>
                  )}
                </td>
              </tr>
            );
          })}

          {others.map((item, index) => {
            const error = billFormFieldError(fieldErrors, `others.${index}.value`);

            return (
              <tr key={`other-${index}`} className="border-b border-border transition-colors hover:bg-muted/20">
                <td className="px-4 py-1.5">
                  <div className="flex items-center gap-2">
                    <Input
                      id={`bill-other-key-${index}`}
                      value={item.key}
                      placeholder="Add Other"
                      className="h-8 border-transparent bg-transparent px-0 shadow-none focus-visible:ring-0"
                      onChange={(e) => updateOther(index, { key: e.target.value })}
                    />
                    {others.length > 1 || item.key.trim() ? (
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeOther(index)}
                        title="Remove"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-1.5">
                  <div className="ml-auto max-w-[8rem]">
                    <BillFormNumericInput
                      id={`bill-other-value-${index}`}
                      value={item.value}
                      className="h-8 text-right"
                      aria-invalid={error ? true : undefined}
                      onChange={(value) => {
                        updateOther(index, { value });
                      }}
                    />
                    <EntityFormFieldError message={error} className="mt-1 text-right" />
                  </div>
                </td>
              </tr>
            );
          })}

          <tr>
            <td colSpan={2} className="px-4 py-2">
              <button
                type="button"
                onClick={addOther}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <Plus className="size-3.5" />
                Add Other Charge
              </button>
            </td>
          </tr>

          <tr className="border-b border-border transition-colors hover:bg-muted/20">
            <td className="px-4 py-2 font-medium">Truck loan</td>
            <td className="px-4 py-2">
              <div className="flex items-center gap-2">
                <Switch
                  id="bill-truck-loan"
                  checked={values.truckLoan}
                  disabled={!truckLoanEnabled}
                  onCheckedChange={onTruckLoanChange}
                />
                <Label htmlFor="bill-truck-loan" className="text-xs font-normal text-muted-foreground">
                  {!truckLoanEnabled
                    ? 'Disabled when advance is entered'
                    : values.truckLoan
                      ? 'Yes'
                      : 'No'}
                </Label>
              </div>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-border bg-muted/50">
            <td className="px-4 py-3 text-right text-sm font-semibold">Grand Total:</td>
            <td className="px-4 py-3 text-right font-mono text-base font-bold tabular-nums text-primary">
              {formatBillFormCurrency(toFormNumber(values.total) ?? 0)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { BillFormMonoInputClass } from '@/components/transactions/bill/bill-form-ui';
import {
  formatBillFormAmount,
  formatBillFormCurrency,
  isTruckLoanAllowed,
  toFormNumber,
} from '@/lib/billForm';
import { cn } from '@/lib/utils';
import { createEmptyBillOtherItem, type BillOtherItem } from '@/types/billOther';
import type { BillFormValues } from '@/types/billForm';

type BillChargesTableProps = {
  values: BillFormValues;
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

function parseNumericInput(raw: string): number | '' {
  if (raw.trim() === '') {
    return '';
  }

  const n = Number(raw);
  return Number.isFinite(n) ? n : '';
}

function formatAmountCell(value: number | ''): string {
  if (value === '') {
    return '0.00';
  }

  return formatBillFormAmount(value) || '0.00';
}

export function BillChargesTable({
  values,
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
          {CHARGE_ROWS.map(([key, label, readOnly]) => (
            <tr key={key} className="border-b border-border transition-colors hover:bg-muted/20">
              <td className="px-4 py-1.5 font-medium">{label}</td>
              <td className="px-4 py-1.5 text-right">
                {readOnly ? (
                  <span className="font-mono tabular-nums">{formatAmountCell(values[key])}</span>
                ) : (
                  <Input
                    id={`bill-${key}`}
                    type="number"
                    inputMode="decimal"
                    value={values[key] === '' ? '' : values[key]}
                    className={cnInput()}
                    onChange={(e) => onNumericChange(key, e.target.value)}
                  />
                )}
              </td>
            </tr>
          ))}

          {others.map((item, index) => (
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
              <td className="px-4 py-1.5 text-right">
                <Input
                  id={`bill-other-value-${index}`}
                  type="number"
                  inputMode="decimal"
                  value={item.value === '' ? '' : item.value}
                  className={cnInput()}
                  onChange={(e) => updateOther(index, { value: parseNumericInput(e.target.value) })}
                />
              </td>
            </tr>
          ))}

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

function cnInput() {
  return cn(BillFormMonoInputClass(), 'ml-auto h-8 max-w-[8rem] text-right');
}

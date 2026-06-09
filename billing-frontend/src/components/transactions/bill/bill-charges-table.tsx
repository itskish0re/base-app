import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { BillFormValues } from '@/types/billForm';

type BillChargesTableProps = {
  values: BillFormValues;
  onNumericChange: (key: keyof BillFormValues, raw: string) => void;
  onTruckLoanChange: (checked: boolean) => void;
};

const CHARGE_ROWS = [
  ['totalFreight', 'Total freight', true],
  ['commission', 'Commission', false],
  ['crossing', 'Crossing', false],
  ['handLoan', 'Hand loan', false],
  ['officeMamul', 'Office mamul', false],
  ['tapalMamul', 'Tapal mamul', false],
  ['diesel', 'Diesel', false],
  ['total', 'Total', true],
] as const;

export function BillChargesTable({
  values,
  onNumericChange,
  onTruckLoanChange,
}: BillChargesTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <table className="w-full min-w-[16rem] border-collapse text-sm">
        <caption className="sr-only">Bill charges</caption>
        <tbody>
          {CHARGE_ROWS.map(([key, label, readOnly]) => (
            <tr key={key} className="border-b last:border-b-0">
              <th className="w-[42%] min-w-[7.5rem] border-r px-3 py-2 text-left font-medium sm:w-[45%]">
                {label}
              </th>
              <td className="px-2 py-1.5">
                <Input
                  id={`bill-${key}`}
                  type="number"
                  inputMode="decimal"
                  value={values[key] === '' ? '' : values[key]}
                  readOnly={readOnly}
                  className={
                    readOnly
                      ? 'h-9 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0'
                      : 'h-9'
                  }
                  onChange={(e) => onNumericChange(key, e.target.value)}
                />
              </td>
            </tr>
          ))}
          <tr>
            <th className="border-r px-3 py-2 text-left font-medium">Truck loan</th>
            <td className="px-3 py-2">
              <div className="flex items-center gap-2">
                <Switch
                  id="bill-truck-loan"
                  checked={values.truckLoan}
                  onCheckedChange={onTruckLoanChange}
                />
                <Label htmlFor="bill-truck-loan" className="text-xs font-normal text-muted-foreground">
                  {values.truckLoan ? 'Yes' : 'No'}
                </Label>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

import { Plus, Trash2 } from 'lucide-react';
import { EntityFormFieldControl } from '@/components/derived/entity-form/ef-field-control';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createEmptyBillOtherItem, sumBillOtherItems, type BillOtherItem } from '@/types/billOther';

type BillOtherChargesProps = {
  items: BillOtherItem[];
  onChange: (items: BillOtherItem[]) => void;
};

function parseNumericInput(raw: string): number | '' {
  if (raw.trim() === '') {
    return '';
  }

  const n = Number(raw);
  return Number.isFinite(n) ? n : '';
}

export function BillOtherCharges({ items, onChange }: BillOtherChargesProps) {
  const total = sumBillOtherItems(items);

  const updateItem = (index: number, patch: Partial<BillOtherItem>) => {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const addItem = () => {
    onChange([...items, createEmptyBillOtherItem()]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) {
      onChange([createEmptyBillOtherItem()]);
      return;
    }

    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-medium">Other charges</h4>
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <Plus className="mr-1 size-4" />
          Add other
        </Button>
      </div>

      {items.map((item, index) => (
        <div key={`other-${index}`} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <EntityFormFieldControl id={`bill-other-key-${index}`} label="Description">
            <Input
              id={`bill-other-key-${index}`}
              value={item.key}
              placeholder="e.g. Toll, Parking"
              onChange={(e) => updateItem(index, { key: e.target.value })}
            />
          </EntityFormFieldControl>
          <EntityFormFieldControl id={`bill-other-value-${index}`} label="Amount">
            <Input
              id={`bill-other-value-${index}`}
              type="number"
              inputMode="decimal"
              value={item.value === '' ? '' : item.value}
              onChange={(e) => updateItem(index, { value: parseNumericInput(e.target.value) })}
            />
          </EntityFormFieldControl>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="mb-0.5 shrink-0"
            onClick={() => removeItem(index)}
            title="Remove"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}

      <p className="text-xs text-muted-foreground tabular-nums">
        Others total: {total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
      </p>
    </div>
  );
}

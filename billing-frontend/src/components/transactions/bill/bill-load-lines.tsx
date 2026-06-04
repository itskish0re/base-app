import { Plus, Trash2 } from 'lucide-react';
import { EntityFormLookupCombobox } from '@/components/derived/entity-form/ef-lookup-combobox';
import { EntityFormFieldControl } from '@/components/derived/entity-form/ef-field-control';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { createEmptyLoadLine, lookupItemLabel } from '@/lib/billForm';
import type { BillLoadFormLine } from '@/types/billForm';
import type { LookupItem } from '@/types/common';

type BillLoadLinesProps = {
  loads: BillLoadFormLine[];
  parties: LookupItem[];
  locations: LookupItem[];
  goods: LookupItem[];
  units: LookupItem[];
  onChange: (loads: BillLoadFormLine[]) => void;
};

function parseNumericInput(raw: string): number | '' {
  if (raw.trim() === '') {
    return '';
  }

  const n = Number(raw);
  return Number.isFinite(n) ? n : '';
}

export function BillLoadLines({
  loads,
  parties,
  locations,
  goods,
  units,
  onChange,
}: BillLoadLinesProps) {
  const updateLine = (index: number, patch: Partial<BillLoadFormLine>) => {
    onChange(loads.map((line, i) => (i === index ? { ...line, ...patch } : line)));
  };

  const addLine = () => {
    onChange([...loads, createEmptyLoadLine()]);
  };

  const removeLine = (index: number) => {
    if (loads.length <= 1) {
      return;
    }

    onChange(loads.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">Loads</h3>
        <Button type="button" variant="outline" size="sm" onClick={addLine}>
          <Plus className="mr-1 size-4" />
          Add line
        </Button>
      </div>

      {loads.map((line, index) => (
        <div
          key={line.loadId ?? `new-${index}`}
          className="space-y-3 rounded-lg border bg-card p-3 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Line {index + 1}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={loads.length <= 1}
              onClick={() => removeLine(index)}
              title="Remove line"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <EntityFormFieldControl id={`load-${index}-consignor`} label="Consignor" required>
              <EntityFormLookupCombobox
                id={`load-${index}-consignor`}
                value={line.consignorId}
                onChange={(value) => {
                  const consignorId = value == null ? null : Number(value);
                  updateLine(index, {
                    consignorId: Number.isFinite(consignorId) ? consignorId : null,
                    consignorName: lookupItemLabel(parties, consignorId),
                  });
                }}
                items={parties}
                placeholder="Select consignor…"
                searchPlaceholder="Search party…"
              />
            </EntityFormFieldControl>

            <EntityFormFieldControl id={`load-${index}-consignee`} label="Consignee" required>
              <EntityFormLookupCombobox
                id={`load-${index}-consignee`}
                value={line.consigneeId}
                onChange={(value) => {
                  const consigneeId = value == null ? null : Number(value);
                  updateLine(index, {
                    consigneeId: Number.isFinite(consigneeId) ? consigneeId : null,
                    consigneeName: lookupItemLabel(parties, consigneeId),
                  });
                }}
                items={parties}
                placeholder="Select consignee…"
                searchPlaceholder="Search party…"
              />
            </EntityFormFieldControl>

            <EntityFormFieldControl id={`load-${index}-to`} label="To" required>
              <EntityFormLookupCombobox
                id={`load-${index}-to`}
                value={line.toId}
                onChange={(value) => {
                  const toId = value == null ? null : Number(value);
                  updateLine(index, {
                    toId: Number.isFinite(toId) ? toId : null,
                    toLocationName: lookupItemLabel(locations, toId),
                  });
                }}
                items={locations}
                placeholder="Select destination…"
                searchPlaceholder="Search location…"
              />
            </EntityFormFieldControl>

            <div className="flex items-end gap-2 pb-1 sm:col-span-2">
              <Switch
                id={`load-${index}-as-per-bill`}
                checked={line.asPerBill}
                onCheckedChange={(checked) => updateLine(index, { asPerBill: checked })}
              />
              <Label htmlFor={`load-${index}-as-per-bill`}>As per bill</Label>
            </div>

            <EntityFormFieldControl id={`load-${index}-goods`} label="Goods" required>
              <EntityFormLookupCombobox
                id={`load-${index}-goods`}
                value={line.goodsId}
                onChange={(value) => {
                  const goodsId = value == null ? null : Number(value);
                  updateLine(index, {
                    goodsId: Number.isFinite(goodsId) ? goodsId : null,
                    goodsName: lookupItemLabel(goods, goodsId),
                  });
                }}
                items={goods}
                placeholder="Select goods…"
                searchPlaceholder="Search goods…"
              />
            </EntityFormFieldControl>

            <EntityFormFieldControl id={`load-${index}-unit`} label="Unit" required>
              <EntityFormLookupCombobox
                id={`load-${index}-unit`}
                value={line.unitId}
                onChange={(value) => {
                  const unitId = value == null ? null : Number(value);
                  updateLine(index, {
                    unitId: Number.isFinite(unitId) ? unitId : null,
                    unitName: lookupItemLabel(units, unitId),
                  });
                }}
                items={units}
                placeholder="Select unit…"
                searchPlaceholder="Search unit…"
              />
            </EntityFormFieldControl>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <EntityFormFieldControl id={`load-${index}-weight`} label="Weight / Qty">
              <Input
                id={`load-${index}-weight`}
                type="number"
                inputMode="decimal"
                value={line.weightOrQuantity === '' ? '' : line.weightOrQuantity}
                onChange={(e) =>
                  updateLine(index, { weightOrQuantity: parseNumericInput(e.target.value) })
                }
              />
            </EntityFormFieldControl>
            <EntityFormFieldControl id={`load-${index}-rate`} label="Rate per unit">
              <Input
                id={`load-${index}-rate`}
                type="number"
                inputMode="decimal"
                value={line.ratePerUnit === '' ? '' : line.ratePerUnit}
                onChange={(e) =>
                  updateLine(index, { ratePerUnit: parseNumericInput(e.target.value) })
                }
              />
            </EntityFormFieldControl>
            <EntityFormFieldControl id={`load-${index}-freight`} label="Freight">
              <Input
                id={`load-${index}-freight`}
                type="number"
                inputMode="decimal"
                value={line.freight === '' ? '' : line.freight}
                onChange={(e) =>
                  updateLine(index, { freight: parseNumericInput(e.target.value) })
                }
              />
            </EntityFormFieldControl>
            <EntityFormFieldControl id={`load-${index}-advance`} label="Advance">
              <Input
                id={`load-${index}-advance`}
                type="number"
                inputMode="decimal"
                value={line.advance === '' ? '' : line.advance}
                onChange={(e) =>
                  updateLine(index, { advance: parseNumericInput(e.target.value) })
                }
              />
            </EntityFormFieldControl>
            <EntityFormFieldControl id={`load-${index}-topay`} label="To pay">
              <Input
                id={`load-${index}-topay`}
                type="number"
                inputMode="decimal"
                value={line.topay === '' ? '' : line.topay}
                onChange={(e) => updateLine(index, { topay: parseNumericInput(e.target.value) })}
              />
            </EntityFormFieldControl>
            <EntityFormFieldControl id={`load-${index}-balance`} label="Balance">
              <Input
                id={`load-${index}-balance`}
                type="number"
                inputMode="decimal"
                value={line.balance === '' ? '' : line.balance}
                readOnly
                className="bg-muted/50"
              />
            </EntityFormFieldControl>
          </div>
        </div>
      ))}
    </div>
  );
}

import { Plus, Trash2, Truck } from 'lucide-react';
import { EntityFormLookupCombobox } from '@/components/derived/entity-form/ef-lookup-combobox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  BillFormAccordionSection,
  BillFormCurrencyAmount,
  BillFormDashedAddButton,
  BillFormField,
  BillFormFinancialPanel,
  BillFormMonoInputClass,
} from '@/components/transactions/bill/bill-form-ui';
import {
  BILL_FORM_MAX_LOAD_ROWS,
  createEmptyLoadLine,
  lookupItemLabel,
  lookupUnitIsFixed,
} from '@/lib/billForm';
import { cn } from '@/lib/utils';
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
    if (loads.length >= BILL_FORM_MAX_LOAD_ROWS) {
      return;
    }

    onChange([...loads, createEmptyLoadLine(Math.max(...loads.map((l) => l.loadNumber), 0) + 1)]);
  };

  const removeLine = (index: number) => {
    if (loads.length <= 1) {
      return;
    }

    onChange(loads.filter((_, i) => i !== index));
  };

  return (
    <BillFormAccordionSection
      icon={Truck}
      title="Load Details"
      action={
        <span className="rounded bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
          {loads.length} of {BILL_FORM_MAX_LOAD_ROWS} Max
        </span>
      }
      contentClassName="space-y-4"
    >
      {loads.map((line, index) => (
        <BillFormAccordionSection
          key={line.loadId ?? `new-${index}`}
          title={`Line Item ${index + 1}`}
          compact
          defaultOpen={loads.length === 1 || index === loads.length - 1}
          action={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-destructive"
              disabled={loads.length <= 1}
              onClick={() => removeLine(index)}
              title="Remove line"
            >
              <Trash2 className="size-4" />
            </Button>
          }
          contentClassName="space-y-4 bg-muted/20"
        >
              <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-12">
                <BillFormField
                  id={`load-${index}-consignor`}
                  label="Consignor"
                  required
                  className="md:col-span-3"
                >
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
                </BillFormField>

                <BillFormField
                  id={`load-${index}-consignee`}
                  label="Consignee"
                  required={!line.asPerBill}
                  className="md:col-span-3"
                >
                  <EntityFormLookupCombobox
                    id={`load-${index}-consignee`}
                    value={line.consigneeId}
                    disabled={line.asPerBill}
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
                </BillFormField>

                <BillFormField id={`load-${index}-to`} label="Destination" required className="md:col-span-2">
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
                </BillFormField>

                <BillFormField id={`load-${index}-goods`} label="Goods Description" required className="md:col-span-2">
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
                </BillFormField>

                <BillFormField id={`load-${index}-unit`} label="Unit" required className="md:col-span-1">
                  <EntityFormLookupCombobox
                    id={`load-${index}-unit`}
                    value={line.unitId}
                    onChange={(value) => {
                      const unitId = value == null ? null : Number(value);
                      updateLine(index, {
                        unitId: Number.isFinite(unitId) ? unitId : null,
                        unitName: lookupItemLabel(units, unitId),
                        unitIsFixed: lookupUnitIsFixed(units, unitId),
                      });
                    }}
                    items={units}
                    placeholder="Unit"
                    searchPlaceholder="Search unit…"
                  />
                </BillFormField>

                <div className="hidden flex-col gap-1.5 md:col-span-1 md:flex">
                  <span className="text-xs font-medium text-muted-foreground">APB</span>
                  <button
                    type="button"
                    title="As per bill"
                    aria-pressed={line.asPerBill}
                    onClick={() =>
                      updateLine(index, {
                        asPerBill: !line.asPerBill,
                        ...(line.asPerBill ? {} : { consigneeId: null, consigneeName: '' }),
                      })
                    }
                    className={cn(
                      'flex h-9 items-center justify-center rounded-md border text-xs font-semibold transition-colors',
                      line.asPerBill
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted',
                    )}
                  >
                    APB
                  </button>
                </div>
              </div>

              <BillFormFinancialPanel>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
                  <BillFormField id={`load-${index}-weight`} label="Weight / Qty">
                    <Input
                      id={`load-${index}-weight`}
                      type="number"
                      inputMode="decimal"
                      className={BillFormMonoInputClass()}
                      value={line.weightOrQuantity === '' ? '' : line.weightOrQuantity}
                      onChange={(e) =>
                        updateLine(index, { weightOrQuantity: parseNumericInput(e.target.value) })
                      }
                    />
                  </BillFormField>

                  <BillFormField id={`load-${index}-rate`} label="Rate">
                    <Input
                      id={`load-${index}-rate`}
                      type="number"
                      inputMode="decimal"
                      className={BillFormMonoInputClass()}
                      value={line.ratePerUnit === '' ? '' : line.ratePerUnit}
                      onChange={(e) =>
                        updateLine(index, { ratePerUnit: parseNumericInput(e.target.value) })
                      }
                    />
                  </BillFormField>

                  <BillFormField id={`load-${index}-freight`} label="Freight">
                    <BillFormCurrencyAmount value={line.freight} />
                  </BillFormField>

                  <BillFormField id={`load-${index}-advance`} label="Advance">
                    <Input
                      id={`load-${index}-advance`}
                      type="number"
                      inputMode="decimal"
                      className={BillFormMonoInputClass()}
                      value={line.advance === '' ? '' : line.advance}
                      onChange={(e) =>
                        updateLine(index, { advance: parseNumericInput(e.target.value) })
                      }
                    />
                  </BillFormField>

                  <BillFormField id={`load-${index}-topay`} label="To Pay">
                    <Input
                      id={`load-${index}-topay`}
                      type="number"
                      inputMode="decimal"
                      className={BillFormMonoInputClass()}
                      value={line.topay === '' ? '' : line.topay}
                      onChange={(e) => updateLine(index, { topay: parseNumericInput(e.target.value) })}
                    />
                  </BillFormField>

                  <BillFormField id={`load-${index}-balance`} label="Balance">
                    <BillFormCurrencyAmount value={line.balance} highlighted />
                  </BillFormField>
                </div>
              </BillFormFinancialPanel>

              <div className="flex items-center gap-2 md:hidden">
                <Switch
                  id={`load-${index}-as-per-bill-mobile`}
                  checked={line.asPerBill}
                  onCheckedChange={(checked) =>
                    updateLine(index, {
                      asPerBill: checked,
                      ...(checked ? { consigneeId: null, consigneeName: '' } : {}),
                    })
                  }
                />
                <Label htmlFor={`load-${index}-as-per-bill-mobile`} className="text-xs">
                  As per bill
                </Label>
              </div>
        </BillFormAccordionSection>
      ))}

      <BillFormDashedAddButton onClick={addLine} disabled={loads.length >= BILL_FORM_MAX_LOAD_ROWS}>
        <Plus className="size-4" />
        Add Load Line
      </BillFormDashedAddButton>
    </BillFormAccordionSection>
  );
}

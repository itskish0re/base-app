import { Plus, Trash2, Truck } from 'lucide-react';
import { EntityFormLookupCombobox } from '@/components/derived/entity-form/ef-lookup-combobox';
import { BillLoadConsigneeField } from '@/components/transactions/bill/bill-load-consignee-field';
import { Button } from '@/components/ui/button';
import {
  BillFormAccordionSection,
  BillFormCurrencyAmount,
  BillFormDashedAddButton,
  BillFormField,
  BillFormFinancialPanel,
  BillFormNumericInput,
} from '@/components/transactions/bill/bill-form-ui';
import {
  BILL_FORM_MAX_LOAD_ROWS,
  billFormFieldError,
  createEmptyLoadLine,
  lookupItemLabel,
  lookupUnitIsFixed,
  type BillFormFieldErrors,
} from '@/lib/billForm';
import type { BillLoadFormLine } from '@/types/billForm';
import type { LookupItem } from '@/types/common';

type BillLoadLinesProps = {
  loads: BillLoadFormLine[];
  fieldErrors?: BillFormFieldErrors;
  parties: LookupItem[];
  locations: LookupItem[];
  goods: LookupItem[];
  units: LookupItem[];
  onChange: (loads: BillLoadFormLine[]) => void;
};

function formatLoadLineTitle(index: number): string {
  const loadNumber = index + 1;
  const mod100 = loadNumber % 100;

  if (mod100 >= 11 && mod100 <= 13) {
    return `${loadNumber}th load`;
  }

  switch (loadNumber % 10) {
    case 1:
      return `${loadNumber}st load`;
    case 2:
      return `${loadNumber}nd load`;
    case 3:
      return `${loadNumber}rd load`;
    default:
      return `${loadNumber}th load`;
  }
}

function loadFieldPath(index: number, field: string): string {
  return `loads.${index}.${field}`;
}

export function BillLoadLines({
  loads,
  fieldErrors,
  parties,
  locations,
  goods,
  units,
  onChange,
}: BillLoadLinesProps) {
  const fieldError = (index: number, field: string) =>
    billFormFieldError(fieldErrors, loadFieldPath(index, field));

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
          title={formatLoadLineTitle(index)}
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
          <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-12">
            <BillFormField
              id={`load-${index}-consignor`}
              label="Consignor"
              required
              className="md:col-span-6"
              error={fieldError(index, 'consignorId')}
            >
              <EntityFormLookupCombobox
                id={`load-${index}-consignor`}
                value={line.consignorId}
                invalid={Boolean(fieldError(index, 'consignorId'))}
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
              className="md:col-span-6"
              error={fieldError(index, 'consigneeId')}
            >
              <BillLoadConsigneeField
                id={`load-${index}-consignee`}
                consigneeId={line.consigneeId}
                asPerBill={line.asPerBill}
                items={parties}
                invalid={Boolean(fieldError(index, 'consigneeId'))}
                onChange={(value) => updateLine(index, value)}
              />
            </BillFormField>
          </div>

          <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-12">
            <BillFormField
              id={`load-${index}-to`}
              label="Destination"
              required
              className="md:col-span-4"
              error={fieldError(index, 'toId')}
            >
              <EntityFormLookupCombobox
                id={`load-${index}-to`}
                value={line.toId}
                invalid={Boolean(fieldError(index, 'toId'))}
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

            <BillFormField
              id={`load-${index}-goods`}
              label="Goods Description"
              required
              className="md:col-span-4"
              error={fieldError(index, 'goodsId')}
            >
              <EntityFormLookupCombobox
                id={`load-${index}-goods`}
                value={line.goodsId}
                invalid={Boolean(fieldError(index, 'goodsId'))}
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

            <BillFormField
              id={`load-${index}-unit`}
              label="Unit"
              required
              className="md:col-span-4"
              error={fieldError(index, 'unitId')}
            >
              <EntityFormLookupCombobox
                id={`load-${index}-unit`}
                value={line.unitId}
                invalid={Boolean(fieldError(index, 'unitId'))}
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
          </div>

          <BillFormFinancialPanel>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
              <BillFormField
                id={`load-${index}-weight`}
                label="Weight / Qty"
                required
                error={fieldError(index, 'weightOrQuantity')}
              >
                <BillFormNumericInput
                  id={`load-${index}-weight`}
                  value={line.weightOrQuantity}
                  aria-invalid={fieldError(index, 'weightOrQuantity') ? true : undefined}
                  onChange={(weightOrQuantity) => updateLine(index, { weightOrQuantity })}
                />
              </BillFormField>

              <BillFormField
                id={`load-${index}-rate`}
                label="Rate"
                required
                error={fieldError(index, 'ratePerUnit')}
              >
                <BillFormNumericInput
                  id={`load-${index}-rate`}
                  value={line.ratePerUnit}
                  aria-invalid={fieldError(index, 'ratePerUnit') ? true : undefined}
                  onChange={(ratePerUnit) => updateLine(index, { ratePerUnit })}
                />
              </BillFormField>

              <BillFormField id={`load-${index}-freight`} label="Freight">
                <BillFormCurrencyAmount value={line.freight} />
              </BillFormField>

              <BillFormField
                id={`load-${index}-advance`}
                label="Advance"
                error={fieldError(index, 'advance')}
              >
                <BillFormNumericInput
                  id={`load-${index}-advance`}
                  value={line.advance}
                  aria-invalid={fieldError(index, 'advance') ? true : undefined}
                  onChange={(advance) => updateLine(index, { advance })}
                />
              </BillFormField>

              <BillFormField id={`load-${index}-topay`} label="To Pay" error={fieldError(index, 'topay')}>
                <BillFormNumericInput
                  id={`load-${index}-topay`}
                  value={line.topay}
                  aria-invalid={fieldError(index, 'topay') ? true : undefined}
                  onChange={(topay) => updateLine(index, { topay })}
                />
              </BillFormField>

              <BillFormField id={`load-${index}-balance`} label="Balance">
                <BillFormCurrencyAmount value={line.balance} highlighted />
              </BillFormField>
            </div>
          </BillFormFinancialPanel>
        </BillFormAccordionSection>
      ))}

      <BillFormDashedAddButton onClick={addLine} disabled={loads.length >= BILL_FORM_MAX_LOAD_ROWS}>
        <Plus className="size-4" />
        Add Load Line
      </BillFormDashedAddButton>
    </BillFormAccordionSection>
  );
}

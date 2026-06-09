import { EntityFormLookupCombobox } from '@/components/derived/entity-form/ef-lookup-combobox';
import { EntityFormFieldControl } from '@/components/derived/entity-form/ef-field-control';
import { DatePicker } from '@/components/ui/date-picker';
import { BillOtherCharges } from '@/components/transactions/bill/bill-other-charges';
import { BillLoadLines } from '@/components/transactions/bill/bill-load-lines';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { lookupItemLabel } from '@/lib/billForm';
import type { BillFormValues } from '@/types/billForm';
import type { LookupItem } from '@/types/common';

type BillFormProps = {
  values: BillFormValues;
  locations: LookupItem[];
  trucks: LookupItem[];
  parties: LookupItem[];
  goods: LookupItem[];
  units: LookupItem[];
  billNumberReadOnly?: boolean;
  onChange: (values: BillFormValues) => void;
  onTruckSelected: (truckId: number) => void;
};

function parseNumericInput(raw: string): number | '' {
  if (raw.trim() === '') {
    return '';
  }

  const n = Number(raw);
  return Number.isFinite(n) ? n : '';
}

function patchNumeric(
  values: BillFormValues,
  key: keyof BillFormValues,
  raw: string,
): BillFormValues {
  return { ...values, [key]: parseNumericInput(raw) };
}

export function BillForm({
  values,
  locations,
  trucks,
  parties,
  goods,
  units,
  billNumberReadOnly = false,
  onChange,
  onTruckSelected,
}: BillFormProps) {
  const patch = (partial: Partial<BillFormValues>) => {
    onChange({ ...values, ...partial });
  };

  return (
    <div className="space-y-6 pb-6">
      <section className="space-y-4">
        <h3 className="text-sm font-semibold">Bill header</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <EntityFormFieldControl id="bill-number" label="Bill number" required>
            <Input
              id="bill-number"
              value={values.billNumber}
              readOnly={billNumberReadOnly}
              onChange={(e) => patch({ billNumber: e.target.value })}
            />
          </EntityFormFieldControl>
          <EntityFormFieldControl id="bill-date" label="Bill date" required>
            <DatePicker
              id="bill-date"
              value={values.billDate}
              onChange={(billDate) => patch({ billDate })}
            />
          </EntityFormFieldControl>
          <EntityFormFieldControl id="bill-from" label="From" required>
            <EntityFormLookupCombobox
              id="bill-from"
              value={values.fromId}
              onChange={(value) => {
                const fromId = value == null ? null : Number(value);
                patch({
                  fromId: Number.isFinite(fromId) ? fromId : null,
                  fromLocationName: lookupItemLabel(locations, fromId),
                });
              }}
              items={locations}
              placeholder="Select from location…"
              searchPlaceholder="Search location…"
            />
          </EntityFormFieldControl>
          <EntityFormFieldControl id="bill-truck" label="Truck" required>
            <EntityFormLookupCombobox
              id="bill-truck"
              value={values.truckId}
              onChange={(value) => {
                const truckId = value == null ? null : Number(value);
                if (truckId != null && Number.isFinite(truckId) && truckId > 0) {
                  patch({
                    truckId,
                    truckNumber: lookupItemLabel(trucks, truckId),
                  });
                  onTruckSelected(truckId);
                } else {
                  patch({
                    truckId: null,
                    truckNumber: '',
                    nameBoardName: '',
                    ownerName: '',
                    ownerMobile: '',
                  });
                }
              }}
              items={trucks}
              placeholder="Select truck…"
              searchPlaceholder="Search truck…"
            />
          </EntityFormFieldControl>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <EntityFormFieldControl id="bill-name-board" label="Name board">
            <Input id="bill-name-board" value={values.nameBoardName} readOnly className="bg-muted/50" />
          </EntityFormFieldControl>
          <EntityFormFieldControl id="bill-owner-name" label="Owner name">
            <Input id="bill-owner-name" value={values.ownerName} readOnly className="bg-muted/50" />
          </EntityFormFieldControl>
          <EntityFormFieldControl id="bill-owner-mobile" label="Owner mobile">
            <Input id="bill-owner-mobile" value={values.ownerMobile} readOnly className="bg-muted/50" />
          </EntityFormFieldControl>
          <EntityFormFieldControl id="bill-driver-name" label="Driver name" required>
            <Input
              id="bill-driver-name"
              value={values.driverName}
              onChange={(e) => patch({ driverName: e.target.value })}
            />
          </EntityFormFieldControl>
          <EntityFormFieldControl id="bill-driver-mobile" label="Driver mobile">
            <Input
              id="bill-driver-mobile"
              value={values.driverMobile}
              onChange={(e) => patch({ driverMobile: e.target.value })}
            />
          </EntityFormFieldControl>
        </div>
      </section>

      <BillLoadLines
        loads={values.loads}
        parties={parties}
        locations={locations}
        goods={goods}
        units={units}
        onChange={(loads) => patch({ loads })}
      />

      <section className="space-y-4">
        <h3 className="text-sm font-semibold">Charges & totals</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(
            [
              ['totalFreight', 'Total freight'],
              ['commission', 'Commission'],
              ['crossing', 'Crossing'],
              ['handLoan', 'Hand loan'],
              ['truckLoan', 'Truck loan'],
              ['officeMamul', 'Office mamul'],
              ['tapalMamul', 'Tapal mamul'],
              ['diesel', 'Diesel'],
              ['total', 'Total'],
            ] as const
          ).map(([key, label]) => (
            <EntityFormFieldControl key={key} id={`bill-${key}`} label={label}>
              <Input
                id={`bill-${key}`}
                type="number"
                inputMode="decimal"
                value={values[key] === '' ? '' : values[key]}
                readOnly={key === 'totalFreight' || key === 'total'}
                className={key === 'totalFreight' || key === 'total' ? 'bg-muted/50' : undefined}
                onChange={(e) => onChange(patchNumeric(values, key, e.target.value))}
              />
            </EntityFormFieldControl>
          ))}
        </div>

        <BillOtherCharges
          items={values.others}
          onChange={(others) => patch({ others })}
        />

        <div className="flex items-center gap-2">
          <Switch
            id="bill-cancelled"
            checked={values.isCancelled}
            onCheckedChange={(checked) => patch({ isCancelled: checked })}
          />
          <Label htmlFor="bill-cancelled">Cancelled</Label>
        </div>
      </section>
    </div>
  );
}

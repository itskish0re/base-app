import { EntityFormLookupCombobox } from '@/components/derived/entity-form/ef-lookup-combobox';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { BillAdvanceSummary } from '@/components/transactions/bill/bill-advance-summary';
import { BillChargesTable } from '@/components/transactions/bill/bill-charges-table';
import {
  BillFormAccordionSection,
  BillFormField,
  BillFormMonoInputClass,
  BillFormPhoneInput,
  BillFormReadOnlyValue,
} from '@/components/transactions/bill/bill-form-ui';
import { BillLoadLines } from '@/components/transactions/bill/bill-load-lines';
import { BillPaymentPanel } from '@/components/transactions/bill/bill-payment-panel';
import {
  billFormFieldError,
  formatBillFormTruckNumber,
  lookupItemLabel,
  parseBillFormNumericInput,
  sumLoadAdvances,
  type BillFormFieldErrors,
} from '@/lib/billForm';
import type { BillFormValues } from '@/types/billForm';
import type { LookupItem } from '@/types/common';
import { FileText, IndianRupee, Receipt, Wallet } from 'lucide-react';

type BillFormProps = {
  values: BillFormValues;
  fieldErrors?: BillFormFieldErrors;
  locations: LookupItem[];
  trucks: LookupItem[];
  parties: LookupItem[];
  goods: LookupItem[];
  units: LookupItem[];
  onChange: (values: BillFormValues) => void;
  onTruckSelected: (truckId: number) => void;
};

function patchNumeric(
  values: BillFormValues,
  key: keyof BillFormValues,
  raw: string,
): BillFormValues {
  const parsed = parseBillFormNumericInput(raw);
  if (parsed === null) {
    return values;
  }

  return { ...values, [key]: parsed };
}

export function BillForm({
  values,
  fieldErrors,
  locations,
  trucks,
  parties,
  goods,
  units,
  onChange,
  onTruckSelected,
}: BillFormProps) {
  const patch = (partial: Partial<BillFormValues>) => {
    onChange({ ...values, ...partial });
  };

  const showAdvanceSummary = sumLoadAdvances(values.loads) > 0;
  const fieldError = (path: string) => billFormFieldError(fieldErrors, path);

  return (
    <div className="relative space-y-4 pb-6">
      {values.isCancelled ? (
        <div
          className="absolute inset-0 z-10 cursor-not-allowed bg-transparent"
          aria-hidden
        />
      ) : null}

      <BillFormAccordionSection icon={FileText} title="Header Information">
        <div className="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-2 lg:grid-cols-4">
          <BillFormField
            id="bill-number"
            label="Bill No."
            required
            error={fieldError('billNumber')}
          >
            <BillFormReadOnlyValue display={values.billNumber || '—'} align="center" bold />
          </BillFormField>

          <BillFormField id="bill-date" label="Date" required error={fieldError('billDate')}>
            <DatePicker id="bill-date" value={values.billDate} onChange={(billDate) => patch({ billDate })} />
          </BillFormField>

          <BillFormField
            id="bill-from"
            label="Origin / Branch"
            required
            className="lg:col-span-2"
            error={fieldError('fromId')}
          >
            <EntityFormLookupCombobox
              id="bill-from"
              value={values.fromId}
              invalid={Boolean(fieldError('fromId'))}
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
          </BillFormField>

          <BillFormField id="bill-truck" label="Truck No." required error={fieldError('truckId')}>
            <EntityFormLookupCombobox
              id="bill-truck"
              value={values.truckId}
              invalid={Boolean(fieldError('truckId'))}
              onChange={(value) => {
                const truckId = value == null ? null : Number(value);
                if (truckId != null && Number.isFinite(truckId) && truckId > 0) {
                  patch({
                    truckId,
                    truckNumber: formatBillFormTruckNumber(lookupItemLabel(trucks, truckId)),
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
              labelFormat="vehicle_number"
              clearable={false}
              placeholder="Select truck…"
              searchPlaceholder="Search truck…"
            />
          </BillFormField>

          <BillFormField id="bill-name-board" label="Name Board">
            <Input
              id="bill-name-board"
              value={values.nameBoardName}
              readOnly
              className={BillFormMonoInputClass(true)}
            />
          </BillFormField>

          <BillFormField id="bill-owner-name" label="Owner Name">
            <Input id="bill-owner-name" value={values.ownerName} readOnly className={BillFormMonoInputClass(true)} />
          </BillFormField>

          <BillFormField id="bill-owner-mobile" label="Owner Mobile">
            <Input
              id="bill-owner-mobile"
              value={values.ownerMobile}
              readOnly
              className={BillFormMonoInputClass(true)}
            />
          </BillFormField>

          <div className="grid grid-cols-1 gap-x-4 gap-y-3 md:col-span-2 md:grid-cols-4 lg:col-span-4">
            <BillFormField
              id="bill-driver-name"
              label="Driver Name"
              required
              className="md:col-span-2"
              error={fieldError('driverName')}
            >
              <Input
                id="bill-driver-name"
                value={values.driverName}
                aria-invalid={fieldError('driverName') ? true : undefined}
                onChange={(e) => patch({ driverName: e.target.value })}
              />
            </BillFormField>

            <BillFormField
              id="bill-driver-mobile-1"
              label="Driver Mobile 1"
              required
              error={fieldError('driverMobile1')}
            >
              <BillFormPhoneInput
                id="bill-driver-mobile-1"
                value={values.driverMobile1}
                aria-invalid={fieldError('driverMobile1') ? true : undefined}
                onChange={(driverMobile1) => patch({ driverMobile1 })}
              />
            </BillFormField>

            <BillFormField
              id="bill-driver-mobile-2"
              label="Driver Mobile 2"
              error={fieldError('driverMobile2')}
            >
              <BillFormPhoneInput
                id="bill-driver-mobile-2"
                value={values.driverMobile2}
                aria-invalid={fieldError('driverMobile2') ? true : undefined}
                onChange={(driverMobile2) => patch({ driverMobile2 })}
              />
            </BillFormField>
          </div>
        </div>
      </BillFormAccordionSection>

      <BillLoadLines
        loads={values.loads}
        fieldErrors={fieldErrors}
        parties={parties}
        locations={locations}
        goods={goods}
        units={units}
        onChange={(loads) => patch({ loads })}
      />

      <section className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
        <BillFormAccordionSection
          icon={Receipt}
          title="Charges Summary"
          className="h-full lg:col-span-2"
          contentClassName="p-0 sm:p-0"
        >
          <BillChargesTable
            values={values}
            fieldErrors={fieldErrors}
            others={values.others}
            onOthersChange={(others) => patch({ others })}
            onNumericChange={(key, raw) => onChange(patchNumeric(values, key, raw))}
            onTruckLoanChange={(checked) => patch({ truckLoan: checked })}
          />
        </BillFormAccordionSection>

        <div className="flex flex-col gap-4">
          <BillFormAccordionSection icon={Wallet} title="Payment Details" className="h-full" contentClassName="p-4 sm:p-5">
            <BillPaymentPanel values={values} fieldErrors={fieldErrors} onChange={patch} embedded />
          </BillFormAccordionSection>

          {showAdvanceSummary ? (
            <BillFormAccordionSection
              icon={IndianRupee}
              title="Advance Summary"
              className="h-full"
              contentClassName="p-4 sm:p-5"
            >
              <BillAdvanceSummary values={values} />
            </BillFormAccordionSection>
          ) : null}
        </div>
      </section>
    </div>
  );
}

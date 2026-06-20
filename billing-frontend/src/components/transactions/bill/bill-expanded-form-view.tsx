import { formatIndianMobile, formatIndianVehicleNumber } from '@/components/derived/data-table/column-cells/formatters';
import { BillAdvanceSummary } from '@/components/transactions/bill/bill-advance-summary';
import { formatBillLoadLineTitle } from '@/components/transactions/bill/bill-load-lines';
import {
  BillFormAccordionSection,
  BillFormCurrencyAmount,
  BillFormField,
  BillFormFinancialPanel,
  BillFormMonoInputClass,
  BillFormReadOnlyValue,
} from '@/components/transactions/bill/bill-form-ui';
import {
  formatBillFormCurrency,
  sumLoadAdvances,
  toFormNumber,
} from '@/lib/billForm';
import { formatBillPreviewDate } from '@/lib/billPreview';
import { BILL_PAY_BY_OPTIONS } from '@/types/entity/bill';
import type { BillFormValues, BillLoadFormLine } from '@/types/billForm';
import { FileText, IndianRupee, Receipt, Truck, Wallet } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type BillExpandedFormViewProps = {
  values: BillFormValues;
  loadsLoading?: boolean;
};

const CHARGE_ROWS = [
  ['totalFreight', 'Total freight'],
  ['commission', 'Commission'],
  ['crossing', 'Crossing'],
  ['officeMamul', 'Office mamul'],
  ['tapalMamul', 'Tapal mamul'],
  ['diesel', 'Diesel'],
  ['handLoan', 'Hand loan'],
] as const;

function ReadOnlyInput({ value, className }: { value: string; className?: string }) {
  return <Input value={value} readOnly className={cn(BillFormMonoInputClass(true), className)} />;
}

function formatConsigneeDisplay(line: BillLoadFormLine): string {
  if (line.asPerBill) {
    return 'As per bill';
  }

  return line.consigneeName || '—';
}

function BillExpandedHeaderSection({ values }: { values: BillFormValues }) {
  return (
    <BillFormAccordionSection icon={FileText} title="Header Information">
      <div className="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-2 lg:grid-cols-4">
        <BillFormField label="Bill No.">
          <BillFormReadOnlyValue display={values.billNumber || '—'} align="center" bold />
        </BillFormField>

        <BillFormField label="Date">
          <BillFormReadOnlyValue
            display={values.billDate ? formatBillPreviewDate(values.billDate) : '—'}
            align="start"
          />
        </BillFormField>

        <BillFormField label="Origin / Branch" className="lg:col-span-2">
          <ReadOnlyInput value={values.fromLocationName || '—'} className="font-sans" />
        </BillFormField>

        <BillFormField label="Truck No.">
          <BillFormReadOnlyValue
            display={formatIndianVehicleNumber(values.truckNumber) || '—'}
            align="start"
          />
        </BillFormField>

        <BillFormField label="Name Board">
          <ReadOnlyInput value={values.nameBoardName || '—'} className="font-sans" />
        </BillFormField>

        <BillFormField label="Owner Name">
          <ReadOnlyInput value={values.ownerName || '—'} className="font-sans" />
        </BillFormField>

        <BillFormField label="Owner Mobile">
          <ReadOnlyInput
            value={values.ownerMobile ? formatIndianMobile(values.ownerMobile) : '—'}
            className="font-sans"
          />
        </BillFormField>

        <div className="grid grid-cols-1 gap-x-4 gap-y-3 md:col-span-2 md:grid-cols-4 lg:col-span-4">
          <BillFormField label="Driver Name" className="md:col-span-2">
            <ReadOnlyInput value={values.driverName || '—'} className="font-sans" />
          </BillFormField>

          <BillFormField label="Driver Mobile 1">
            <ReadOnlyInput
              value={values.driverMobile1 ? formatIndianMobile(values.driverMobile1) : '—'}
              className="font-sans"
            />
          </BillFormField>

          <BillFormField label="Driver Mobile 2">
            <ReadOnlyInput
              value={values.driverMobile2 ? formatIndianMobile(values.driverMobile2) : '—'}
              className="font-sans"
            />
          </BillFormField>
        </div>
      </div>
    </BillFormAccordionSection>
  );
}

function BillExpandedLoadLinesSection({
  loads,
  loadsLoading,
}: {
  loads: BillLoadFormLine[];
  loadsLoading?: boolean;
}) {
  return (
    <BillFormAccordionSection
      icon={Truck}
      title="Load Details"
      action={
        <span className="rounded bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
          {loadsLoading ? '…' : loads.length} load{loads.length === 1 ? '' : 's'}
        </span>
      }
      contentClassName="space-y-4"
    >
      {loadsLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      ) : loads.length === 0 ? (
        <p className="text-sm text-muted-foreground">No loads on this bill.</p>
      ) : (
        loads.map((line, index) => (
          <BillFormAccordionSection
            key={line.loadId ?? `load-${index}`}
            title={formatBillLoadLineTitle(index)}
            compact
            defaultOpen={loads.length === 1 || index === loads.length - 1}
            contentClassName="space-y-4 bg-muted/20"
          >
            <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-12">
              <BillFormField label="Consignor" className="md:col-span-6">
                <ReadOnlyInput value={line.consignorName || '—'} className="font-sans" />
              </BillFormField>

              <BillFormField label="Consignee" className="md:col-span-6">
                <ReadOnlyInput value={formatConsigneeDisplay(line)} className="font-sans" />
              </BillFormField>
            </div>

            <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-12">
              <BillFormField label="Destination" className="md:col-span-4">
                <ReadOnlyInput value={line.toLocationName || '—'} className="font-sans" />
              </BillFormField>

              <BillFormField label="Goods Description" className="md:col-span-4">
                <ReadOnlyInput value={line.goodsName || '—'} className="font-sans" />
              </BillFormField>

              <BillFormField label="Unit" className="md:col-span-4">
                <ReadOnlyInput value={line.unitName || '—'} className="font-sans" />
              </BillFormField>
            </div>

            <BillFormFinancialPanel>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
                <BillFormField label="Weight / Qty">
                  <BillFormCurrencyAmount value={line.weightOrQuantity} />
                </BillFormField>

                <BillFormField label="Rate">
                  <BillFormCurrencyAmount value={line.ratePerUnit} />
                </BillFormField>

                <BillFormField label="Freight">
                  <BillFormCurrencyAmount value={line.freight} />
                </BillFormField>

                <BillFormField label="Advance">
                  <BillFormCurrencyAmount value={line.advance} />
                </BillFormField>

                <BillFormField label="To Pay">
                  <BillFormCurrencyAmount value={line.topay} />
                </BillFormField>

                <BillFormField label="Balance">
                  <BillFormCurrencyAmount value={line.balance} highlighted />
                </BillFormField>
              </div>
            </BillFormFinancialPanel>
          </BillFormAccordionSection>
        ))
      )}
    </BillFormAccordionSection>
  );
}

function BillExpandedChargesSection({ values }: { values: BillFormValues }) {
  const others = values.others.filter((item) => item.key.trim() || toFormNumber(item.value));

  return (
    <BillFormAccordionSection
      icon={Receipt}
      title="Charges Summary"
      className="h-full lg:col-span-2"
      contentClassName="p-0 sm:p-0"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[20rem] border-collapse text-sm">
          <caption className="sr-only">Bill charges</caption>
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                Description
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">
                Amount (+)
              </th>
            </tr>
          </thead>
          <tbody>
            {CHARGE_ROWS.map(([key, label]) => (
              <tr key={key} className="border-b border-border">
                <td className="px-4 py-1.5 font-medium">{label}</td>
                <td className="px-4 py-1.5">
                  <BillFormCurrencyAmount
                    value={values[key]}
                    className="ml-auto max-w-[8rem]"
                  />
                </td>
              </tr>
            ))}

            {others.map((item, index) => (
              <tr key={`other-${index}`} className="border-b border-border">
                <td className="px-4 py-1.5 font-medium">{item.key.trim() || 'Other'}</td>
                <td className="px-4 py-1.5">
                  <BillFormCurrencyAmount value={item.value} className="ml-auto max-w-[8rem]" />
                </td>
              </tr>
            ))}

            <tr className="border-b border-border">
              <td className="px-4 py-2 font-medium">Truck loan</td>
              <td className="px-4 py-2 text-right text-sm text-foreground">
                {values.truckLoan ? 'Yes' : 'No'}
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
    </BillFormAccordionSection>
  );
}

function BillExpandedPaymentSection({ values }: { values: BillFormValues }) {
  const payByLabel =
    BILL_PAY_BY_OPTIONS.find((option) => option.value === values.payBy)?.label ?? '—';

  return (
    <BillFormAccordionSection
      icon={Wallet}
      title="Payment Details"
      className="h-full"
      contentClassName="p-4 sm:p-5"
    >
      <div className="space-y-4">
        <BillFormField label="Payment Mode">
          <BillFormReadOnlyValue display={payByLabel} align="start" />
        </BillFormField>

        {values.payBy === 'upi' ? (
          <>
            <BillFormField label="Paid name">
              <ReadOnlyInput value={values.paidName || '—'} className="font-sans" />
            </BillFormField>
            <BillFormField label="Paid mobile">
              <ReadOnlyInput
                value={values.paidMobile ? formatIndianMobile(values.paidMobile) : '—'}
                className="font-sans"
              />
            </BillFormField>
          </>
        ) : null}
      </div>
    </BillFormAccordionSection>
  );
}

export function BillExpandedFormView({ values, loadsLoading = false }: BillExpandedFormViewProps) {
  const showAdvanceSummary = !loadsLoading && sumLoadAdvances(values.loads) > 0;

  return (
    <div
      className={cn(
        'relative mx-auto w-full max-w-6xl space-y-4 py-1',
        values.isCancelled && 'opacity-75',
      )}
    >
      {values.isCancelled ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm font-medium text-destructive">
          This bill is cancelled.
        </div>
      ) : null}

      <BillExpandedHeaderSection values={values} />

      <BillExpandedLoadLinesSection loads={values.loads} loadsLoading={loadsLoading} />

      <section className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
        <BillExpandedChargesSection values={values} />

        <div className="flex flex-col gap-4">
          <BillExpandedPaymentSection values={values} />

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

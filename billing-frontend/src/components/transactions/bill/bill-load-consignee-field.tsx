import { EntityFormLookupCombobox } from '@/components/derived/entity-form/ef-lookup-combobox';
import { lookupItemLabel } from '@/lib/billForm';
import { cn } from '@/lib/utils';
import type { LookupItem } from '@/types/common';

type BillLoadConsigneeFieldProps = {
  id?: string;
  consigneeId: number | null;
  asPerBill: boolean;
  items: LookupItem[];
  onChange: (value: {
    consigneeId: number | null;
    consigneeName: string;
    asPerBill: boolean;
  }) => void;
};

function AsPerBillToggleButton({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      title="As per bill"
      aria-pressed={active}
      aria-label="As per bill"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onToggle();
      }}
      className={cn(
        'flex h-6 shrink-0 items-center justify-center rounded-[calc(var(--radius)-5px)] border px-1.5 text-[10px] font-semibold leading-none transition-colors',
        active
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted',
      )}
    >
      APB
    </button>
  );
}

export function BillLoadConsigneeField({
  id,
  consigneeId,
  asPerBill,
  items,
  onChange,
}: BillLoadConsigneeFieldProps) {
  return (
    <EntityFormLookupCombobox
      id={id}
      value={consigneeId}
      disabled={asPerBill}
      clearable={!asPerBill}
      items={items}
      placeholder={asPerBill ? 'As per bill' : 'Select consignee…'}
      searchPlaceholder="Search party…"
      onChange={(value) => {
        const nextConsigneeId = value == null ? null : Number(value);
        onChange({
          consigneeId: Number.isFinite(nextConsigneeId) ? nextConsigneeId : null,
          consigneeName: lookupItemLabel(items, nextConsigneeId),
          asPerBill: false,
        });
      }}
      addonBeforeTrigger={
        <AsPerBillToggleButton
          active={asPerBill}
          onToggle={() => {
            if (asPerBill) {
              onChange({
                consigneeId,
                consigneeName: lookupItemLabel(items, consigneeId),
                asPerBill: false,
              });
              return;
            }

            onChange({
              consigneeId: null,
              consigneeName: '',
              asPerBill: true,
            });
          }}
        />
      }
    />
  );
}

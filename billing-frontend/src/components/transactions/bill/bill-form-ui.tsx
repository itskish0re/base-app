import { ChevronDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

type BillFormAccordionSectionProps = {
  icon?: LucideIcon;
  title: string;
  action?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  compact?: boolean;
};

export function BillFormAccordionSection({
  icon: Icon,
  title,
  action,
  defaultOpen = true,
  children,
  className,
  contentClassName,
  compact = false,
}: BillFormAccordionSectionProps) {
  return (
    <Collapsible
      defaultOpen={defaultOpen}
      className={cn('group/bill-accordion overflow-hidden rounded-lg border bg-card shadow-sm', className)}
    >
      <div
        className={cn(
          'flex items-center gap-2 border-b border-border bg-card',
          compact ? 'px-3 py-2' : 'px-4 py-3 sm:px-5',
        )}
      >
        <CollapsibleTrigger
          className={cn(
            'flex min-w-0 flex-1 items-center gap-2 rounded-md text-left transition-colors',
            'hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            compact ? 'py-0.5' : 'py-1',
          )}
        >
          {Icon ? <Icon className="size-5 shrink-0 text-primary" aria-hidden /> : null}
          <span
            className={cn(
              'truncate text-sm font-semibold tracking-tight text-foreground',
            )}
          >
            {title}
          </span>
          <ChevronDown
            className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-open/bill-accordion:rotate-180"
            aria-hidden
          />
        </CollapsibleTrigger>
        {action ? (
          <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
            {action}
          </div>
        ) : null}
      </div>
      <CollapsibleContent>
        <div className={cn(compact ? 'p-3' : 'p-4 sm:p-5', contentClassName)}>{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

type BillFormFieldLabelProps = {
  htmlFor?: string;
  children: ReactNode;
  required?: boolean;
  className?: string;
};

export function BillFormFieldLabel({
  htmlFor,
  children,
  required,
  className,
}: BillFormFieldLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('text-xs font-medium text-muted-foreground', className)}
    >
      {children}
      {required ? <span className="text-destructive"> *</span> : null}
    </label>
  );
}

type BillFormFieldProps = {
  id?: string;
  label: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
};

export function BillFormField({ id, label, required, children, className }: BillFormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <BillFormFieldLabel htmlFor={id} required={required}>
        {label}
      </BillFormFieldLabel>
      {children}
    </div>
  );
}

type BillFormFinancialPanelProps = {
  children: ReactNode;
  className?: string;
};

export function BillFormFinancialPanel({ children, className }: BillFormFinancialPanelProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-muted/30 p-3',
        className,
      )}
    >
      {children}
    </div>
  );
}

type BillFormCurrencyAmountProps = {
  value: number | '' | null | undefined;
  highlighted?: boolean;
  className?: string;
};

export function BillFormCurrencyAmount({
  value,
  highlighted = false,
  className,
}: BillFormCurrencyAmountProps) {
  const display =
    value === '' || value == null
      ? '0.00'
      : Number(value).toLocaleString('en-IN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

  return (
    <BillFormReadOnlyValue display={display} highlighted={highlighted} className={className} />
  );
}

type BillFormReadOnlyValueProps = {
  display: string;
  highlighted?: boolean;
  align?: 'start' | 'center' | 'end';
  bold?: boolean;
  className?: string;
};

export function BillFormReadOnlyValue({
  display,
  highlighted = false,
  align = 'end',
  bold = false,
  className,
}: BillFormReadOnlyValueProps) {
  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'flex h-9 items-center rounded-md border px-3 font-mono text-sm tabular-nums',
          align === 'center' && 'justify-center',
          align === 'end' && 'justify-end',
          align === 'start' && 'justify-start',
          'border-border bg-muted/50',
          bold && 'font-bold',
          highlighted && 'border-transparent bg-secondary/40 font-semibold text-foreground',
        )}
      >
        {display}
      </div>
    </div>
  );
}

type BillFormDashedAddButtonProps = {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
};

export function BillFormDashedAddButton({
  children,
  onClick,
  disabled,
  className,
}: BillFormDashedAddButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border text-sm font-medium text-muted-foreground transition-colors',
        'hover:border-primary hover:bg-muted/40 hover:text-primary disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function BillFormMonoInputClass(readOnly = false) {
  return cn(
    'h-9 font-mono text-sm tabular-nums',
    readOnly && 'border-border bg-muted/50',
  );
}

import { format, isValid, parseISO } from 'date-fns';
import { CalendarIcon, XIcon } from 'lucide-react';
import { useMemo, useState, type MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type DatePickerProps = {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  clearable?: boolean;
  className?: string;
};

function parseDateValue(value: string | undefined): Date | undefined {
  if (!value?.trim()) {
    return undefined;
  }

  const parsed = parseISO(value.trim());
  return isValid(parsed) ? parsed : undefined;
}

function formatDateValue(date: Date | undefined): string {
  if (!date) {
    return '';
  }

  return format(date, 'yyyy-MM-dd');
}

export function DatePicker({
  id,
  value = '',
  onChange,
  onBlur,
  disabled = false,
  readOnly = false,
  placeholder = 'Pick a date…',
  clearable = true,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selectedDate = useMemo(() => parseDateValue(value), [value]);
  const isDisabled = disabled || readOnly;
  const displayValue = selectedDate ? format(selectedDate, 'dd/MM/yyyy') : placeholder;

  const handleSelect = (date: Date | undefined) => {
    onChange?.(formatDateValue(date));
    setOpen(false);
  };

  const handleClear = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onChange?.('');
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        if (isDisabled) {
          return;
        }

        setOpen(nextOpen);
        if (!nextOpen) {
          onBlur?.();
        }
      }}
    >
      <div className={cn('relative flex w-full', className)}>
        <PopoverTrigger
          id={id}
          disabled={isDisabled}
          className={cn(
            'inline-flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors',
            'hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            !selectedDate && 'text-muted-foreground',
            clearable && selectedDate && !isDisabled && 'pr-9',
          )}
        >
          <span className="flex min-w-0 flex-1 items-center gap-2 truncate text-left">
            <CalendarIcon className="size-4 shrink-0 opacity-60" />
            <span className="truncate">{displayValue}</span>
          </span>
        </PopoverTrigger>
        {clearable && selectedDate && !isDisabled ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-1 size-7 -translate-y-1/2"
            aria-label="Clear date"
            onClick={handleClear}
          >
            <XIcon className="size-3.5" />
          </Button>
        ) : null}
      </div>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={selectedDate} onSelect={handleSelect} />
        {clearable && selectedDate ? (
          <div className="border-t p-2">
            <Button
              type="button"
              variant="ghost"
              className="h-8 w-full justify-start font-normal text-muted-foreground"
              onClick={() => {
                onChange?.('');
                setOpen(false);
              }}
            >
              Clear
            </Button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}

import { Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group';
import {
  BILL_NUMBER_MIN,
  compareBillNumbers,
  decrementBillNumber,
  incrementBillNumber,
  isBillNumberWithinRange,
} from '@/lib/billNumberNavigation';
import { cn } from '@/lib/utils';

type BillFormNavigatorProps = {
  billNumber: string;
  maxBillNumber: string;
  disabled?: boolean;
  isNavigating?: boolean;
  onNavigate: (billNumber: string) => void | Promise<void>;
  className?: string;
};

export function BillFormNavigator({
  billNumber,
  maxBillNumber,
  disabled = false,
  isNavigating = false,
  onNavigate,
  className,
}: BillFormNavigatorProps) {
  const [draft, setDraft] = useState(billNumber);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(billNumber);
    setError(null);
  }, [billNumber]);

  const canDecrement =
    !disabled &&
    !isNavigating &&
    decrementBillNumber(draft) != null &&
    compareBillNumbers(draft, BILL_NUMBER_MIN) > 0;

  const canIncrement =
    !disabled &&
    !isNavigating &&
    maxBillNumber.trim() !== '' &&
    compareBillNumbers(draft, maxBillNumber) < 0;

  const commitNavigation = async (nextBillNumber: string) => {
    const trimmed = nextBillNumber.trim();
    if (!trimmed) {
      setError('Enter a bill number.');
      return;
    }

    if (!isBillNumberWithinRange(trimmed, BILL_NUMBER_MIN, maxBillNumber)) {
      setError(`Bill number must be between ${BILL_NUMBER_MIN} and ${maxBillNumber}.`);
      return;
    }

    if (trimmed === billNumber.trim()) {
      setError(null);
      return;
    }

    setError(null);
    await onNavigate(trimmed);
  };

  return (
    <div className={cn('flex min-w-0 flex-col gap-1', className)}>
      <div className="flex min-w-0 items-center gap-2">
        <span className="shrink-0 text-xs font-medium text-muted-foreground sm:text-sm">Bill No.</span>
        <InputGroup className="h-9 w-[9.5rem] shrink-0 sm:w-[10.5rem]">
          <InputGroupAddon align="inline-start">
            <InputGroupButton
              size="icon-xs"
              aria-label="Previous bill"
              disabled={!canDecrement}
              onClick={() => {
                const previous = decrementBillNumber(draft);
                if (previous) {
                  void commitNavigation(previous);
                }
              }}
            >
              <Minus />
            </InputGroupButton>
          </InputGroupAddon>
          <InputGroupInput
            value={draft}
            inputMode="text"
            aria-label="Bill number"
            aria-invalid={error ? true : undefined}
            disabled={disabled || isNavigating}
            className="text-center font-mono text-sm tabular-nums"
            onChange={(event) => {
              setDraft(event.target.value);
              setError(null);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                void commitNavigation(draft);
              }
            }}
            onBlur={() => {
              if (draft.trim() !== billNumber.trim()) {
                void commitNavigation(draft);
              }
            }}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              aria-label="Next bill"
              disabled={!canIncrement}
              onClick={() => {
                void commitNavigation(incrementBillNumber(draft));
              }}
            >
              <Plus />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        {maxBillNumber.trim() ? (
          <InputGroupText className="hidden text-xs text-muted-foreground sm:inline">
            / {maxBillNumber}
          </InputGroupText>
        ) : null}
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

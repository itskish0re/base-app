import { Eye, RotateCcw } from 'lucide-react';
import type { ReactNode } from 'react';
import { BillFormToolbarButton } from '@/components/transactions/bill/bill-form-toolbar-button';
import { cn } from '@/lib/utils';

type BillFormTopToolbarProps = {
  mode: 'create' | 'edit';
  navigator?: ReactNode;
  onPreview: () => void;
  onReset: () => void;
  isLoading?: boolean;
  className?: string;
};

export function BillFormTopToolbar({
  mode,
  navigator,
  onPreview,
  onReset,
  isLoading = false,
  className,
}: BillFormTopToolbarProps) {
  return (
    <div
      className={cn(
        'flex w-full min-w-0 items-center gap-2 rounded-lg border border-border bg-background/95 px-2 py-1.5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:gap-3 sm:px-3 sm:py-2',
        className,
      )}
    >
      {mode === 'edit' ? navigator : <div className="min-w-0 flex-1" />}

      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <BillFormToolbarButton
          label="Reset"
          icon={RotateCcw}
          onClick={onReset}
          disabled={isLoading}
        />
        <BillFormToolbarButton
          label="Preview"
          icon={Eye}
          onClick={onPreview}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}

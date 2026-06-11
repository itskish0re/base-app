import { Eye, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

type BillFormActionBarProps = {
  isCancelled: boolean;
  onCancelledChange: (cancelled: boolean) => void;
  onSave: () => void;
  isSaving?: boolean;
  isLoading?: boolean;
  className?: string;
};

export function BillFormActionBar({
  isCancelled,
  onCancelledChange,
  onSave,
  isSaving = false,
  isLoading = false,
  className,
}: BillFormActionBarProps) {
  return (
    <div
      className={cn(
        'flex w-full min-w-0 flex-col gap-1.5 rounded-lg border border-border bg-background/95 p-1.5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2 sm:p-2',
        className,
      )}
    >
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 sm:border-r sm:border-border sm:pr-3">
        <Switch
          id="bill-actionbar-cancelled"
          checked={isCancelled}
          onCheckedChange={onCancelledChange}
        />
        <Label htmlFor="bill-actionbar-cancelled" className="text-xs font-medium sm:text-sm">
          Cancelled
        </Label>
      </div>

      <div
        className={cn(
          'flex min-w-0 flex-wrap items-center gap-1.5 sm:ml-auto sm:gap-2',
          'max-sm:w-full max-sm:justify-end',
        )}
      >
        <Button
          type="button"
          size="sm"
          className="h-8 shrink-0 px-2.5 text-xs sm:h-9 sm:px-4 sm:text-sm"
          onClick={onSave}
          disabled={isSaving || isLoading}
        >
          <Save className="size-3.5 sm:size-4" />
          {isSaving ? 'Saving…' : (
            <>
              <span className="sm:hidden">Save</span>
              <span className="hidden sm:inline">Save Bill</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

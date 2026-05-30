import { HourglassIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type EntityFormLoadingPanelProps = {
  className?: string;
};

/** Fixed-height shell body placeholder while form metadata is not ready yet. */
export function EntityFormLoadingPanel({ className }: EntityFormLoadingPanelProps) {
  return (
    <div
      className={cn(
        'flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-lg border border-border bg-muted/15',
        className,
      )}
      aria-busy="true"
      aria-label="Loading form"
    >
      <HourglassIcon className="size-8 text-muted-foreground/80" strokeWidth={1.5} />
      <p className="text-sm text-muted-foreground">Loading</p>
    </div>
  );
}

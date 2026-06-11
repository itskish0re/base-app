import { Eye } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type BillFormTopToolbarProps = {
  mode: 'create' | 'edit';
  navigator?: ReactNode;
  onPreview: () => void;
  isLoading?: boolean;
  className?: string;
};

export function BillFormTopToolbar({
  mode,
  navigator,
  onPreview,
  isLoading = false,
  className,
}: BillFormTopToolbarProps) {
  return (
    <div
      className={cn(
        'flex w-full min-w-0 items-center gap-3 rounded-lg border border-border bg-background/95 px-2 py-1.5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-3 sm:py-2',
        className,
      )}
    >
      {mode === 'edit' ? navigator : <div className="min-w-0 flex-1" />}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="ml-auto h-8 shrink-0 px-2.5 text-xs sm:h-9 sm:px-4 sm:text-sm"
        onClick={onPreview}
        disabled={isLoading}
      >
        <Eye className="size-3.5 sm:size-4" />
        Preview
      </Button>
    </div>
  );
}

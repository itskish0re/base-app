import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BillFormScreenProps = {
  formError?: string | null;
  saveError?: string | null;
  topToolbar: ReactNode;
  actionBar: ReactNode;
  children: ReactNode;
  className?: string;
};

/** Bill create/edit shell: toolbar, action bar, then scrollable form. */
export function BillFormScreen({
  formError,
  saveError,
  topToolbar,
  actionBar,
  children,
  className,
}: BillFormScreenProps) {
  return (
    <div className={cn('flex min-h-0 flex-1 flex-col overflow-hidden', className)}>
      <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col gap-3 overflow-hidden px-0 py-2 sm:gap-3 sm:py-4">
        {formError ? <p className="shrink-0 text-sm text-destructive">{formError}</p> : null}
        {saveError ? <p className="shrink-0 text-sm text-destructive">{saveError}</p> : null}

        <div className="flex shrink-0 flex-col gap-2 sm:gap-2">
          {topToolbar}
          {actionBar}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

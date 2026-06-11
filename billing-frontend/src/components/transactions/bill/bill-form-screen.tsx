import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BillFormScreenProps = {
  topToolbar: ReactNode;
  actionBar: ReactNode;
  children: ReactNode;
  className?: string;
};

/** Bill create/edit shell — desktop: toolbar, action bar, form; mobile: toolbar, form, action bar. */
export function BillFormScreen({
  topToolbar,
  actionBar,
  children,
  className,
}: BillFormScreenProps) {
  return (
    <div className={cn('flex min-h-0 flex-1 flex-col overflow-hidden', className)}>
      <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col gap-3 overflow-hidden px-0 py-2 sm:gap-3 sm:py-4">
        <div className="order-1 shrink-0">{topToolbar}</div>

        <div className="order-2 min-h-0 flex-1 overflow-y-auto sm:order-3">{children}</div>

        <div className="order-3 shrink-0 sm:order-2">{actionBar}</div>
      </div>
    </div>
  );
}

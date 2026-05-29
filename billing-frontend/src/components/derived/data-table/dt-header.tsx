import type { ReactNode } from 'react';

export type DtHeaderProps = {
  title?: ReactNode;
  actions?: ReactNode;
};

export function DtHeader({ title, actions }: DtHeaderProps) {
  if (!title && !actions) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
      <div className="min-w-0">
        {title ? <h2 className="text-lg font-semibold tracking-tight">{title}</h2> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}

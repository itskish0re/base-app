import { MoreHorizontal } from 'lucide-react';
import { Fragment } from 'react';
import { DtActionIconButton } from '@/components/derived/data-table/dt-action-button';
import type { DataTableRowActionItem } from '@/components/derived/data-table/dt-row-action-items';
import { dataTableColumnFlexJustifyClass } from '@/components/derived/data-table/dt-utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export type DtRowActionsBarProps = {
  items: DataTableRowActionItem[];
  align?: 'left' | 'center' | 'right';
  ellipsisMode?: boolean;
  isPending?: boolean;
  overflowMenuLabel?: string;
};

function RowActionsOverflowMenu({
  items,
  align,
  overflowMenuLabel,
  isPending,
}: DtRowActionsBarProps) {
  const menuAlign = align === 'right' ? 'end' : align === 'center' ? 'center' : 'start';
  const ctx = { disabled: Boolean(isPending) };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<span className="inline-flex" />}>
        <DtActionIconButton
          label={overflowMenuLabel ?? 'Actions'}
          icon={MoreHorizontal}
          disabled={ctx.disabled}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align={menuAlign} className="w-44">
        {items.map((item) => (
          <Fragment key={item.id}>{item.renderMenu(ctx)}</Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Renders row action items inline or collapsed to an ellipsis menu. Used internally by DataTable. */
export function DtRowActionsBar({
  items,
  align = 'center',
  ellipsisMode = false,
  isPending = false,
  overflowMenuLabel = 'Actions',
}: DtRowActionsBarProps) {
  const visibleItems = items.filter((item) => !item.hidden);
  const ctx = { disabled: isPending };
  const flexClass = dataTableColumnFlexJustifyClass(align);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <TooltipProvider delay={300}>
      <div className={cn('flex w-full min-w-0 items-center', flexClass)}>
        {ellipsisMode ? (
          <RowActionsOverflowMenu
            items={visibleItems}
            align={align}
            overflowMenuLabel={overflowMenuLabel}
            isPending={isPending}
          />
        ) : (
          <div className="flex items-center gap-0.5">
            {visibleItems.map((item) => (
              <Fragment key={item.id}>{item.renderInline(ctx)}</Fragment>
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

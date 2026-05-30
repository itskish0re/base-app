import { MoreHorizontal } from 'lucide-react';
import { DT_ACTIONS_HEADER_TOOLTIP } from '@/components/derived/data-table/dt-constants';
import type { DataTableColumnDef } from '@/components/derived/data-table/dt-types';
import { dataTableColumnFlexJustifyClass } from '@/components/derived/data-table/dt-utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type DtActionsColumnHeaderProps = {
  align?: DataTableColumnDef['align'];
  label?: string;
  tooltip?: string;
  ellipsisMode?: boolean;
};

/** Actions column header: text label inline, ellipsis icon when column is collapsed. */
export function DtActionsColumnHeader({
  align = 'center',
  label = DT_ACTIONS_HEADER_TOOLTIP,
  tooltip = DT_ACTIONS_HEADER_TOOLTIP,
  ellipsisMode = false,
}: DtActionsColumnHeaderProps) {
  const flexClass = dataTableColumnFlexJustifyClass(align);

  if (!ellipsisMode) {
    return (
      <div className={cn('flex w-full min-w-0 items-center', flexClass)}>
        <span>{label}</span>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className={cn('flex w-full min-w-0 items-center', flexClass)}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className="inline-flex size-8 shrink-0 items-center justify-center text-muted-foreground"
              aria-label={tooltip}
            >
              <MoreHorizontal className="size-4" />
            </span>
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

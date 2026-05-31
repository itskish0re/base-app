import { useRef } from 'react';
import { DtCellOverflow } from '@/components/derived/data-table/column-cells/dt-cell-overflow';
import { formatCodeBadgeLabel } from '@/components/derived/data-table/column-cells/formatters';
import type { DataTableColumnCellProps } from '@/components/derived/data-table/column-cells/types';
import { Badge } from '@/components/ui/badge';

export function BadgeCell({ value, column }: DataTableColumnCellProps) {
  const label = formatCodeBadgeLabel(value);
  const textRef = useRef<HTMLSpanElement>(null);

  if (!label) {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <DtCellOverflow
      label={label}
      align={column.align}
      shrinkWrap
      measureRef={textRef}
    >
      <Badge
        variant="secondary"
        className="inline-flex min-w-0 max-w-full overflow-hidden font-mono tracking-wide"
      >
        <span ref={textRef} className="min-w-0 truncate">
          {label}
        </span>
      </Badge>
    </DtCellOverflow>
  );
}

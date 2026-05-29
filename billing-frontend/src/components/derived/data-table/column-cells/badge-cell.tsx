import { DtCellOverflow } from '@/components/derived/data-table/column-cells/dt-cell-overflow';
import { formatCodeBadgeLabel } from '@/components/derived/data-table/column-cells/formatters';
import type { DataTableColumnCellProps } from '@/components/derived/data-table/column-cells/types';
import { Badge } from '@/components/ui/badge';

export function BadgeCell({ value, column }: DataTableColumnCellProps) {
  const label = formatCodeBadgeLabel(value);

  if (!label) {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <DtCellOverflow label={label} align={column.align}>
      <Badge variant="secondary" className="max-w-full truncate font-mono tracking-wide">
        {label}
      </Badge>
    </DtCellOverflow>
  );
}

import { DtCellOverflow } from '@/components/derived/data-table/column-cells/dt-cell-overflow';
import { formatIndianMobile } from '@/components/derived/data-table/column-cells/formatters';
import type { DataTableColumnCellProps } from '@/components/derived/data-table/column-cells/types';

export function MobileCell({ value, column }: DataTableColumnCellProps) {
  const label = formatIndianMobile(value);

  if (!label) {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <DtCellOverflow label={label} align={column.align}>
      <span className="font-mono text-sm tracking-tight">{label}</span>
    </DtCellOverflow>
  );
}

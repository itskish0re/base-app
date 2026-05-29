import { DtCellOverflow } from '@/components/derived/data-table/column-cells/dt-cell-overflow';
import { formatDataTableDate } from '@/components/derived/data-table/column-cells/formatters';
import type { DataTableColumnCellProps } from '@/components/derived/data-table/column-cells/types';

export function DateCell({ value, column }: DataTableColumnCellProps) {
  const label = formatDataTableDate(value);

  if (!label) {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <DtCellOverflow label={label} align={column.align}>
      <span className="tabular-nums">{label}</span>
    </DtCellOverflow>
  );
}

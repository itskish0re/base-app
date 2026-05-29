import { DtCellOverflow } from '@/components/derived/data-table/column-cells/dt-cell-overflow';
import { formatDataTableDisplayValue } from '@/components/derived/data-table/column-cells/formatters';
import type { DataTableColumnCellProps } from '@/components/derived/data-table/column-cells/types';

export function DefaultCell({ value, column }: DataTableColumnCellProps) {
  const label = formatDataTableDisplayValue(value);

  if (!label) {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <DtCellOverflow label={label} align={column.align}>
      {label}
    </DtCellOverflow>
  );
}

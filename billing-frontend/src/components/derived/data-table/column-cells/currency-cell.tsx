import { DtCellOverflow } from '@/components/derived/data-table/column-cells/dt-cell-overflow';
import { formatInrCurrency } from '@/components/derived/data-table/column-cells/formatters';
import type { DataTableColumnCellProps } from '@/components/derived/data-table/column-cells/types';

export function CurrencyCell({ value, column }: DataTableColumnCellProps) {
  const label = formatInrCurrency(value);

  if (!label) {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <DtCellOverflow label={label} align={column.align ?? 'right'}>
      <span className="tabular-nums">{label}</span>
    </DtCellOverflow>
  );
}

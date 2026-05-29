import { DtCellOverflow } from '@/components/derived/data-table/column-cells/dt-cell-overflow';
import { formatIndianVehicleNumber } from '@/components/derived/data-table/column-cells/formatters';
import type { DataTableColumnCellProps } from '@/components/derived/data-table/column-cells/types';

export function VehicleNumberCell({ value, column }: DataTableColumnCellProps) {
  const label = formatIndianVehicleNumber(value);

  if (!label) {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <DtCellOverflow label={label} align={column.align}>
      <span className="font-mono text-sm font-medium uppercase tracking-wide">{label}</span>
    </DtCellOverflow>
  );
}

import { resolveColumnCellComponent } from '@/components/derived/data-table/column-cells/registry';
import type { DataTableColumnCellProps } from '@/components/derived/data-table/column-cells/types';

export function DataTableCell(props: DataTableColumnCellProps) {
  const CellComponent = resolveColumnCellComponent(props.column.columnComponent);
  return <CellComponent {...props} />;
}

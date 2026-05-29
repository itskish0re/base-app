import { formatDataTableDisplayValue } from '@/components/derived/data-table/column-cells/formatters';
import type { DataTableColumnCellProps } from '@/components/derived/data-table/column-cells/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function BooleanCell({ value, column }: DataTableColumnCellProps) {
  if (value === null || value === undefined || value === '') {
    return <span className="text-muted-foreground">—</span>;
  }

  const isTrue = value === true || value === 'true' || value === 1 || value === '1';
  const label = formatDataTableDisplayValue(isTrue);

  return (
    <div className={cn('flex', column.align === 'center' && 'justify-center', column.align === 'right' && 'justify-end')}>
      <Badge variant={isTrue ? 'success' : 'muted'}>{label}</Badge>
    </div>
  );
}

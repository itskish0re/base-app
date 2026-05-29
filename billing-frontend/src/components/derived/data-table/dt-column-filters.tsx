import type { DataTableColumnDef } from '@/components/derived/data-table/dt-types';
import { useDataTable } from '@/components/derived/data-table/hooks';
import { Input } from '@/components/ui/input';
import { TableHead, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

function cellAlignClass(align: DataTableColumnDef['align']): string {
  if (align === 'center') {
    return 'text-center';
  }

  if (align === 'right') {
    return 'text-right';
  }

  return 'text-left';
}

type DtColumnFiltersProps = {
  visibleColumns: DataTableColumnDef[];
  hasActionsColumn: boolean;
};

export function DtColumnFilters({ visibleColumns, hasActionsColumn }: DtColumnFiltersProps) {
  const { columnFilters, setColumnFilter } = useDataTable();

  return (
    <TableRow className="bg-muted/30 hover:bg-muted/30">
      {visibleColumns.map((column) => (
        <TableHead
          key={`filter-${column.id}`}
          className={cn('py-2 font-normal', cellAlignClass(column.align))}
          style={{
            width: column.width ?? undefined,
            minWidth: column.minWidth ?? undefined,
          }}
        >
          <Input
            type="search"
            value={columnFilters[column.id] ?? ''}
            placeholder={`Search ${column.header}`}
            className="h-8 w-full min-w-[4rem] bg-background text-xs font-normal"
            onChange={(event) => setColumnFilter(column.id, event.target.value)}
          />
        </TableHead>
      ))}
      {hasActionsColumn ? <TableHead className="py-2" /> : null}
    </TableRow>
  );
}

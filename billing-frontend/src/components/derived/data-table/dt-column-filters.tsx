import {
  actionsColumnStyle,
  dataColumnStyle,
  DT_STICKY_ACTIONS_HEAD_CLASS,
  type DataTableLayout,
} from '@/components/derived/data-table/dt-column-layout';
import type { DataTableColumnDef } from '@/components/derived/data-table/dt-types';
import { useDataTable } from '@/components/derived/data-table/hooks';
import { Input } from '@/components/ui/input';
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
  layout: DataTableLayout;
  visibleDataColumns: DataTableColumnDef[];
  showActionsColumn: boolean;
};

export function DtColumnFilters({
  layout,
  visibleDataColumns,
  showActionsColumn,
}: DtColumnFiltersProps) {
  const { columnFilters, setColumnFilter } = useDataTable();

  return (
    <tr className="border-b bg-muted/30 hover:bg-muted/30">
      {visibleDataColumns.map((column) => (
        <th
          key={`filter-${column.id}`}
          className={cn('py-2 font-normal', cellAlignClass(column.align))}
          style={dataColumnStyle(layout, column.id)}
        >
          <Input
            type="search"
            value={columnFilters[column.id] ?? ''}
            placeholder={`Search ${column.header}`}
            className="h-8 w-full min-w-[4rem] bg-background text-xs font-normal"
            onChange={(event) => setColumnFilter(column.id, event.target.value)}
          />
        </th>
      ))}
      {showActionsColumn ? (
        <th
          className={cn('py-2 font-normal', DT_STICKY_ACTIONS_HEAD_CLASS)}
          style={actionsColumnStyle(layout)}
        />
      ) : null}
    </tr>
  );
}

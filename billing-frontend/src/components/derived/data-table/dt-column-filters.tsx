import {
  actionsColumnStyle,
  dataColumnStyle,
  type DataTableLayout,
} from '@/components/derived/data-table/dt-column-layout';
import {
  DT_TABLE_FILTER_ROW_BG_CLASS,
  DT_TABLE_FILTER_STICKY_CLASS,
} from '@/components/derived/data-table/dt-constants';
import type { DataTableColumnDef } from '@/components/derived/data-table/dt-types';
import { useDataTable } from '@/components/derived/data-table/hooks';
import { dataTableColumnAlignClass } from '@/components/derived/data-table/dt-utils';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type DtColumnFiltersProps = {
  layout: DataTableLayout;
  visibleDataColumns: DataTableColumnDef[];
  showActionsColumn: boolean;
  actionsColumn: DataTableColumnDef | null;
};

export function DtColumnFilters({
  layout,
  visibleDataColumns,
  showActionsColumn,
  actionsColumn,
}: DtColumnFiltersProps) {
  const { columnFilters, setColumnFilter } = useDataTable();

  return (
    <tr className={cn('border-b hover:bg-secondary', DT_TABLE_FILTER_ROW_BG_CLASS)}>
      {visibleDataColumns.map((column) => (
        <th
          key={`filter-${column.id}`}
          className={cn(
            'py-2 px-2 font-normal',
            DT_TABLE_FILTER_STICKY_CLASS,
            DT_TABLE_FILTER_ROW_BG_CLASS,
            dataTableColumnAlignClass(column.align),
          )}
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
          className={cn(
            'py-2 px-2 font-normal',
            DT_TABLE_FILTER_STICKY_CLASS,
            DT_TABLE_FILTER_ROW_BG_CLASS,
            'sticky right-0 z-40 border-l shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.12)]',
            dataTableColumnAlignClass(actionsColumn?.align),
          )}
          style={actionsColumnStyle(layout)}
        />
      ) : null}
    </tr>
  );
}

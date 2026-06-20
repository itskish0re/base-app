import { DataTableCell } from '@/components/derived/data-table/column-cells';
import type { DataTableColumnDef } from '@/components/derived/data-table/dt-types';
import { cn } from '@/lib/utils';

type DataTableExpandedFieldsProps<TRow extends object> = {
  row: TRow;
  columns: DataTableColumnDef[];
  className?: string;
};

/** Label/value grid for expanded row detail using the column cell registry. */
export function DataTableExpandedFields<TRow extends object>({
  row,
  columns,
  className,
}: DataTableExpandedFieldsProps<TRow>) {
  if (columns.length === 0) {
    return null;
  }

  return (
    <dl
      className={cn(
        'grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3',
        className,
      )}
    >
      {columns.map((column) => {
        const value = row[column.fieldName as keyof TRow];

        return (
          <div key={column.id} className="min-w-0">
            <dt className="text-xs font-medium text-muted-foreground">{column.header}</dt>
            <dd className="mt-0.5 min-w-0 font-medium text-foreground">
              <DataTableCell value={value} column={column} />
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

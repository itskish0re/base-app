import type { DataTableColumnDef } from '@/components/derived/data-table/dt-types';

export function formatDataTableCellValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  return String(value);
}

export function buildInitialColumnVisibility(
  columns: DataTableColumnDef[],
): Record<string, boolean> {
  return Object.fromEntries(columns.map((column) => [column.id, column.visible]));
}

export function getVisibleDataTableColumns(
  columns: DataTableColumnDef[],
  columnVisibility: Record<string, boolean>,
): DataTableColumnDef[] {
  return columns.filter((column) => columnVisibility[column.id] !== false);
}

export function applyColumnFilters<TRow extends object>(
  rows: TRow[],
  columns: DataTableColumnDef[],
  columnFilters: Record<string, string>,
): TRow[] {
  const activeFilters = columns
    .map((column) => ({ column, value: columnFilters[column.id]?.trim() ?? '' }))
    .filter((entry) => entry.value.length > 0);

  if (activeFilters.length === 0) {
    return rows;
  }

  return rows.filter((row) =>
    activeFilters.every(({ column, value }) => {
      const cell = row[column.fieldName as keyof TRow];
      return formatDataTableCellValue(cell).toLowerCase().includes(value.toLowerCase());
    }),
  );
}

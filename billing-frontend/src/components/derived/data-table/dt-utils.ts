import { getColumnCellSearchText } from '@/components/derived/data-table/column-cells/get-cell-search-text';
import {
  defaultColumnVisibleInGrid,
  isDisplayableGridColumn,
  type DataTableColumnDef,
} from '@/components/derived/data-table/dt-types';

export function dataTableColumnAlignClass(align: DataTableColumnDef['align']): string {
  if (align === 'center') {
    return 'text-center';
  }

  if (align === 'right') {
    return 'text-right';
  }

  return 'text-left';
}

export function dataTableColumnFlexJustifyClass(align: DataTableColumnDef['align']): string {
  if (align === 'center') {
    return 'justify-center';
  }

  if (align === 'right') {
    return 'justify-end';
  }

  return 'justify-start';
}

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
  return Object.fromEntries(
    columns.map((column) => [column.id, defaultColumnVisibleInGrid(column)]),
  );
}

/** Data columns the user can toggle in the column picker. */
export function getToggleableDataTableColumns(
  columns: DataTableColumnDef[],
): DataTableColumnDef[] {
  return columns.filter(isDisplayableGridColumn);
}

export function getVisibleDataTableColumns(
  columns: DataTableColumnDef[],
  columnVisibility: Record<string, boolean>,
): DataTableColumnDef[] {
  return columns.filter(
    (column) => isDisplayableGridColumn(column) && columnVisibility[column.id] !== false,
  );
}

/** Soft-delete / inactive rows (`is_active` on entity DTOs). */
export function isInactiveDataTableRow(row: { isActive?: boolean }): boolean {
  return row.isActive === false;
}

export function inactiveDataTableRowClassName(row: { isActive?: boolean }): string | undefined {
  return isInactiveDataTableRow(row) ? 'opacity-60 text-muted-foreground' : undefined;
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
      return getColumnCellSearchText(cell, column).toLowerCase().includes(value.toLowerCase());
    }),
  );
}

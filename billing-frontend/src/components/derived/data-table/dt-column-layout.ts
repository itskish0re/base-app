import type { DataTableColumnDef } from '@/components/derived/data-table/dt-types';

/** Base grid width; column percents are shares of this unit (sum may exceed 100 → horizontal scroll). */
export const DT_GRID_BASE_WIDTH_PERCENT = 100;

/** Default width for the sticky actions column when not overridden. */
export const DT_ACTIONS_COLUMN_WIDTH_PERCENT = 12;

export type DataTableLayout = {
  /** Table width relative to the scroll container (e.g. 180 = 180% → scroll). */
  tableWidthPercent: number;
  /** Width of each data column as % of the table. */
  columnWidthPercentOfTable: Map<string, number>;
  actionsWidthPercentOfTable: number | null;
};

export function resolveColumnWidthPercent(column: DataTableColumnDef): number {
  const percent = column.widthPercent ?? 0;
  return percent > 0 ? percent : 15;
}

export function computeDataTableLayout(
  columns: DataTableColumnDef[],
  hasActionsColumn: boolean,
  actionsWidthPercent: number = DT_ACTIONS_COLUMN_WIDTH_PERCENT,
): DataTableLayout {
  const dataTotal = columns.reduce((sum, column) => sum + resolveColumnWidthPercent(column), 0);
  const actionsShare = hasActionsColumn ? Math.max(actionsWidthPercent, 1) : 0;
  const tableWidthPercent = Math.max(DT_GRID_BASE_WIDTH_PERCENT, dataTotal + actionsShare);

  const columnWidthPercentOfTable = new Map<string, number>();
  for (const column of columns) {
    const share = resolveColumnWidthPercent(column);
    columnWidthPercentOfTable.set(column.id, (share / tableWidthPercent) * 100);
  }

  const actionsWidthPercentOfTable = hasActionsColumn
    ? (actionsShare / tableWidthPercent) * 100
    : null;

  return {
    tableWidthPercent,
    columnWidthPercentOfTable,
    actionsWidthPercentOfTable,
  };
}

export function dataColumnStyle(
  layout: DataTableLayout,
  columnId: string,
): { width: string } {
  const width = layout.columnWidthPercentOfTable.get(columnId) ?? 0;
  return { width: `${width}%` };
}

export function actionsColumnStyle(layout: DataTableLayout): { width: string } {
  return { width: `${layout.actionsWidthPercentOfTable ?? DT_ACTIONS_COLUMN_WIDTH_PERCENT}%` };
}

export const DT_STICKY_ACTIONS_HEAD_CLASS =
  'sticky right-0 z-20 border-l bg-background shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.12)]';

export const DT_STICKY_ACTIONS_CELL_CLASS =
  'sticky right-0 z-10 border-l bg-background shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.08)] group-hover:bg-muted/50';

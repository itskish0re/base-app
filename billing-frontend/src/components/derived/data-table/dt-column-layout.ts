import type { DataTableColumnDef } from '@/components/derived/data-table/dt-types';
import { isActionsColumn } from '@/components/derived/data-table/dt-types';

/** Base grid width; column percents are shares of this unit. */
export const DT_GRID_BASE_WIDTH_PERCENT = 100;

export const DT_DEFAULT_ACTIONS_COLUMN_WIDTH_PERCENT = 12;

export type DataTableLayout = {
  /** Table width relative to the scroll container (100 = fit; &gt;100 = horizontal scroll). */
  tableWidthPercent: number;
  /** Each data column width as % of the table element. */
  columnWidthPercentOfTable: Map<string, number>;
  /** Actions column width as % of the table element. */
  actionsWidthPercentOfTable: number | null;
};

export function resolveColumnWidthPercent(column: DataTableColumnDef): number {
  const percent = column.widthPercent ?? 0;
  return percent > 0 ? percent : 15;
}

/**
 * Distributes column widths against a 100-wide base minus the actions column.
 * When configured data columns sum below the data budget, remaining space is split equally.
 * When above budget, configured widths are used and the table grows past 100 (scroll).
 */
export function computeDataTableLayout(
  visibleDataColumns: DataTableColumnDef[],
  actionsWidthPercent: number = DT_DEFAULT_ACTIONS_COLUMN_WIDTH_PERCENT,
): DataTableLayout {
  const actionsShare = Math.max(actionsWidthPercent, 1);
  const dataBudget = DT_GRID_BASE_WIDTH_PERCENT - actionsShare;
  const count = visibleDataColumns.length;

  if (count === 0) {
    return {
      tableWidthPercent: DT_GRID_BASE_WIDTH_PERCENT,
      columnWidthPercentOfTable: new Map(),
      actionsWidthPercentOfTable: actionsShare,
    };
  }

  const requestedSum = visibleDataColumns.reduce(
    (sum, column) => sum + resolveColumnWidthPercent(column),
    0,
  );

  const columnWidthPercentOfTable = new Map<string, number>();

  if (requestedSum <= dataBudget) {
    const eachShare = dataBudget / count;
    for (const column of visibleDataColumns) {
      columnWidthPercentOfTable.set(column.id, eachShare);
    }

    return {
      tableWidthPercent: DT_GRID_BASE_WIDTH_PERCENT,
      columnWidthPercentOfTable,
      actionsWidthPercentOfTable: actionsShare,
    };
  }

  const tableWidthPercent = requestedSum + actionsShare;
  for (const column of visibleDataColumns) {
    const share = resolveColumnWidthPercent(column);
    columnWidthPercentOfTable.set(column.id, (share / tableWidthPercent) * 100);
  }

  return {
    tableWidthPercent,
    columnWidthPercentOfTable,
    actionsWidthPercentOfTable: (actionsShare / tableWidthPercent) * 100,
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
  const width = layout.actionsWidthPercentOfTable ?? DT_DEFAULT_ACTIONS_COLUMN_WIDTH_PERCENT;
  return { width: `${width}%` };
}

export const DT_STICKY_ACTIONS_HEAD_CLASS =
  'sticky right-0 z-20 border-l bg-background shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.12)]';

export const DT_STICKY_ACTIONS_CELL_CLASS =
  'sticky right-0 z-10 border-l bg-background shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.08)] group-hover:bg-muted/50';

export function getActionsColumnWidthPercent(
  columns: DataTableColumnDef[],
  fallback: number = DT_DEFAULT_ACTIONS_COLUMN_WIDTH_PERCENT,
): number {
  const actionsColumn = columns.find(isActionsColumn);
  if (!actionsColumn) {
    return fallback;
  }

  return resolveColumnWidthPercent(actionsColumn);
}

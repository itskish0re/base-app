import type { DataTableColumnDef } from '@/components/derived/data-table/dt-types';
import { isActionsColumn } from '@/components/derived/data-table/dt-types';
import { cn } from '@/lib/utils';

/** Base grid width; column percents are shares of this unit. */
export const DT_GRID_BASE_WIDTH_PERCENT = 100;

export const DT_DEFAULT_ACTIONS_COLUMN_WIDTH_PERCENT = 12;

/** Inline row action control sizes (px). */
export const DT_ACTION_ICON_WIDTH_PX = 32;
export const DT_ACTION_SWITCH_WIDTH_PX = 44;
export const DT_ACTION_ITEM_GAP_PX = 2;

/** Fixed actions column width when collapsed to ellipsis menu (one icon button + cell padding). */
export const DT_ACTIONS_ELLIPSIS_COLUMN_WIDTH_PX = 48;

export type DataTableRowActionSlots = {
  update?: boolean;
  toggle?: boolean;
  delete?: boolean;
};

export type DataTableLayout = {
  /** Table width relative to the scroll container (100 = fit; &gt;100 = horizontal scroll). */
  tableWidthPercent: number;
  /** Each data column width as % of the table element. */
  columnWidthPercentOfTable: Map<string, number>;
  /** Actions column width as % of the table element (budget only when ellipsis uses fixed px). */
  actionsWidthPercentOfTable: number | null;
  /** When true, actions column renders at `DT_ACTIONS_ELLIPSIS_COLUMN_WIDTH_PX`. */
  actionsEllipsisMode: boolean;
};

export type ComputeDataTableLayoutOptions = {
  actionsEllipsisMode?: boolean;
  tableContainerWidthPx?: number;
};

export function resolveColumnWidthPercent(column: DataTableColumnDef): number {
  const percent = column.widthPercent ?? 0;
  return percent > 0 ? percent : 15;
}

export function estimateActionsInlineMinWidthPx(slots: DataTableRowActionSlots): number {
  let width = 0;

  const add = (itemWidth: number) => {
    width += (width > 0 ? DT_ACTION_ITEM_GAP_PX : 0) + itemWidth;
  };

  if (slots.update) {
    add(DT_ACTION_ICON_WIDTH_PX);
  }

  if (slots.toggle) {
    add(DT_ACTION_SWITCH_WIDTH_PX);
  }

  if (slots.delete) {
    add(DT_ACTION_ICON_WIDTH_PX);
  }

  return width > 0 ? width : DT_ACTION_ICON_WIDTH_PX;
}

export function shouldUseActionsEllipsisMode(
  containerWidthPx: number,
  configuredActionsWidthPercent: number,
  inlineMinWidthPx: number,
): boolean {
  if (containerWidthPx <= 0) {
    return false;
  }

  const allocatedPx = (configuredActionsWidthPercent / 100) * containerWidthPx;
  return allocatedPx < inlineMinWidthPx;
}

/**
 * Distributes column widths against a 100-wide base minus the actions column.
 * When configured data columns sum below the data budget, remaining space is split equally.
 * When above budget, configured widths are used and the table grows past 100 (scroll).
 */
export function computeDataTableLayout(
  visibleDataColumns: DataTableColumnDef[],
  actionsWidthPercent: number = DT_DEFAULT_ACTIONS_COLUMN_WIDTH_PERCENT,
  options?: ComputeDataTableLayoutOptions,
): DataTableLayout {
  const actionsEllipsisMode = options?.actionsEllipsisMode ?? false;
  const containerWidthPx = options?.tableContainerWidthPx ?? 0;

  let actionsShare = Math.max(actionsWidthPercent, 1);
  if (actionsEllipsisMode && containerWidthPx > 0) {
    actionsShare = Math.max((DT_ACTIONS_ELLIPSIS_COLUMN_WIDTH_PX / containerWidthPx) * 100, 1);
  }

  const dataBudget = DT_GRID_BASE_WIDTH_PERCENT - actionsShare;
  const count = visibleDataColumns.length;

  if (count === 0) {
    return {
      tableWidthPercent: DT_GRID_BASE_WIDTH_PERCENT,
      columnWidthPercentOfTable: new Map(),
      actionsWidthPercentOfTable: actionsShare,
      actionsEllipsisMode,
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
      actionsEllipsisMode,
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
    actionsEllipsisMode,
  };
}

export function dataColumnStyle(
  layout: DataTableLayout,
  columnId: string,
): { width: string } {
  const width = layout.columnWidthPercentOfTable.get(columnId) ?? 0;
  return { width: `${width}%` };
}

export function actionsColumnStyle(layout: DataTableLayout): {
  width: string;
  minWidth?: string;
  maxWidth?: string;
} {
  if (layout.actionsEllipsisMode) {
    const px = `${DT_ACTIONS_ELLIPSIS_COLUMN_WIDTH_PX}px`;
    return { width: px, minWidth: px, maxWidth: px };
  }

  const width = layout.actionsWidthPercentOfTable ?? DT_DEFAULT_ACTIONS_COLUMN_WIDTH_PERCENT;
  return { width: `${width}%` };
}

/** Left edge + drop shadow when the pinned actions column overlays data cells. */
export const DT_STICKY_ACTIONS_OVERLAY_CLASS =
  'shadow-[-6px_0_12px_-4px_hsl(var(--foreground)/0.08)] before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-px before:bg-border before:content-[""]';

export function getStickyActionsHeadClass(isOverlaying: boolean): string {
  return cn('sticky right-0 bg-muted', isOverlaying && DT_STICKY_ACTIONS_OVERLAY_CLASS);
}

export function getStickyActionsCellClass(isOverlaying: boolean): string {
  return cn(
    'sticky right-0 z-10 bg-background group-hover:bg-muted/50',
    isOverlaying && DT_STICKY_ACTIONS_OVERLAY_CLASS,
  );
}

export function getStickyActionsFilterClass(isOverlaying: boolean): string {
  return cn('sticky right-0 z-40 bg-secondary', isOverlaying && DT_STICKY_ACTIONS_OVERLAY_CLASS);
}

/** @deprecated Use `getStickyActionsHeadClass(isOverlaying)` */
export const DT_STICKY_ACTIONS_HEAD_CLASS = 'sticky right-0 bg-muted';

/** @deprecated Use `getStickyActionsCellClass(isOverlaying)` */
export const DT_STICKY_ACTIONS_CELL_CLASS =
  'sticky right-0 z-10 bg-background group-hover:bg-muted/50';

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

import { BadgeCell } from '@/components/derived/data-table/column-cells/badge-cell';
import { BooleanCell } from '@/components/derived/data-table/column-cells/boolean-cell';
import { CurrencyCell } from '@/components/derived/data-table/column-cells/currency-cell';
import { DateCell } from '@/components/derived/data-table/column-cells/date-cell';
import { DefaultCell } from '@/components/derived/data-table/column-cells/default-cell';
import { MobileCell } from '@/components/derived/data-table/column-cells/mobile-cell';
import type { DataTableColumnCellComponent } from '@/components/derived/data-table/column-cells/types';
import { VehicleNumberCell } from '@/components/derived/data-table/column-cells/vehicle-number-cell';

/** Keys match `app_entity_screen_column.column_component` (lowercase). */
const COLUMN_CELL_REGISTRY: Record<string, DataTableColumnCellComponent> = {
  text: DefaultCell,
  badge: BadgeCell,
  boolean: BooleanCell,
  date: DateCell,
  currency: CurrencyCell,
  mobile: MobileCell,
  phone: MobileCell,
  vehicle_number: VehicleNumberCell,
  truck_number: VehicleNumberCell,
};

export function resolveColumnCellComponent(
  columnComponent: string | null | undefined,
): DataTableColumnCellComponent {
  const key = (columnComponent ?? 'text').trim().toLowerCase();
  return COLUMN_CELL_REGISTRY[key] ?? DefaultCell;
}

import {
  formatCodeBadgeLabel,
  formatDataTableDate,
  formatDataTableDisplayValue,
  formatIndianMobile,
  formatIndianVehicleNumber,
  formatInrCurrency,
} from '@/components/derived/data-table/column-cells/formatters';
import type { DataTableColumnDef } from '@/components/derived/data-table/dt-types';

/** Plain text used for client-side column filter matching. */
export function getColumnCellSearchText(value: unknown, column: DataTableColumnDef): string {
  const key = (column.columnComponent ?? 'text').trim().toLowerCase();

  switch (key) {
    case 'badge':
      return formatCodeBadgeLabel(value);
    case 'mobile':
    case 'phone':
      return formatIndianMobile(value);
    case 'vehicle_number':
    case 'truck_number':
      return formatIndianVehicleNumber(value);
    case 'currency':
      return formatInrCurrency(value);
    case 'date':
      return formatDataTableDate(value);
    case 'boolean':
      return formatDataTableDisplayValue(value);
    default:
      return formatDataTableDisplayValue(value);
  }
}

import type { ReactNode } from 'react';
import type { DataTableColumnDef } from '@/components/derived/data-table/dt-types';

export type DataTableColumnCellProps = {
  value: unknown;
  column: DataTableColumnDef;
};

export type DataTableColumnCellComponent = (props: DataTableColumnCellProps) => ReactNode;

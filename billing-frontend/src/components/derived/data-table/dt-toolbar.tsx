import { DtToolbarOptions } from '@/components/derived/data-table/dt-toolbar-options';
import { DtToolbarSearch } from '@/components/derived/data-table/dt-toolbar-search';

export type DtToolbarProps = {
  searchPlaceholder?: string;
};

/** Toolbar: options (left) and global search (right). */
export function DtToolbar({ searchPlaceholder }: DtToolbarProps) {
  return (
    <div className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
      <DtToolbarOptions />
      <DtToolbarSearch placeholder={searchPlaceholder} />
    </div>
  );
}

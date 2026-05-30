import {
  DT_TABLE_FETCH_PROGRESS_STICKY_CLASS,
  DT_TABLE_FETCH_PROGRESS_STICKY_WITH_FILTER_CLASS,
} from '@/components/derived/data-table/dt-constants';
import { cn } from '@/lib/utils';

type DtTableFetchProgressProps = {
  columnCount: number;
  showColumnSearch: boolean;
  visible: boolean;
};

/** Thin indeterminate bar pinned under the sticky table header during background fetches. */
export function DtTableFetchProgress({
  columnCount,
  showColumnSearch,
  visible,
}: DtTableFetchProgressProps) {
  if (!visible) {
    return null;
  }

  return (
    <tr aria-hidden className="pointer-events-none border-0">
      <td
        colSpan={columnCount}
        className={cn(
          'sticky z-50 h-0 p-0',
          showColumnSearch
            ? DT_TABLE_FETCH_PROGRESS_STICKY_WITH_FILTER_CLASS
            : DT_TABLE_FETCH_PROGRESS_STICKY_CLASS,
        )}
      >
        <div
          className="relative h-[2px] w-full overflow-hidden bg-border/50"
          role="progressbar"
          aria-label="Loading table data"
        >
          <div className="absolute inset-y-0 w-1/3 bg-primary dt-fetch-progress" />
        </div>
      </td>
    </tr>
  );
}

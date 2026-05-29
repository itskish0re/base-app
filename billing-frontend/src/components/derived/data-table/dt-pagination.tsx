import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDataTable } from '@/components/derived/data-table/hooks';
import { Button } from '@/components/ui/button';

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

export function DtPagination() {
  const { tableState, totalCount, isFetching, setPage, setPageSize } = useDataTable();
  const { page, pageSize } = tableState.pagination;
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize) || 1);
  const from = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalCount);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
      <p className="text-muted-foreground">
        {totalCount === 0
          ? 'No rows'
          : `Showing ${from}–${to} of ${totalCount}${isFetching ? ' (updating…)' : ''}`}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-muted-foreground">
          Rows
          <select
            className="h-8 rounded-md border border-input bg-background px-2 text-foreground"
            value={pageSize}
            onChange={(event) => setPageSize(Number(event.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <span className="text-muted-foreground">
          Page {page} of {pageCount}
        </span>

        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={page <= 1 || isFetching}
          aria-label="Previous page"
          onClick={() => setPage(page - 1)}
        >
          <ChevronLeft className="size-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={page >= pageCount || isFetching}
          aria-label="Next page"
          onClick={() => setPage(page + 1)}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

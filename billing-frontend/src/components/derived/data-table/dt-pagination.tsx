import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from 'lucide-react';
import { useMemo, type ReactNode } from 'react';
import { buildPaginationRange } from '@/components/derived/data-table/dt-pagination-range';
import { DT_DEFAULT_PAGE_SIZE_OPTIONS } from '@/components/derived/data-table/dt-constants';
import type { DataTablePaginationOptions } from '@/components/derived/data-table/dt-types';
import { useDataTable } from '@/components/derived/data-table/hooks';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type DtPaginationProps = {
  options?: DataTablePaginationOptions;
};

type PageControlProps = {
  disabled?: boolean;
  active?: boolean;
  className?: string;
  onClick?: () => void;
  'aria-label'?: string;
  children: ReactNode;
};

function PageControl({
  disabled,
  active,
  className,
  onClick,
  children,
  'aria-label': ariaLabel,
}: PageControlProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={disabled}
      aria-label={ariaLabel}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'size-9 shrink-0 rounded-none border-r border-border shadow-none',
        active && 'bg-muted font-medium text-foreground hover:bg-muted',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function PageEllipsis() {
  return (
    <span
      aria-hidden
      className="inline-flex size-9 shrink-0 items-center justify-center border-r border-border text-muted-foreground"
    >
      <MoreHorizontal className="size-4" />
    </span>
  );
}

export function DtPagination({ options }: DtPaginationProps) {
  const { tableState, totalCount, isFetching, setPage, setPageSize } = useDataTable();
  const { page, pageSize } = tableState.pagination;

  const leadingCount = options?.leadingCount ?? 3;
  const trailingCount = options?.trailingCount ?? options?.boundaryCount ?? 1;
  const showFirstLast = options?.showFirstLast ?? true;
  const showPageSize = options?.showPageSize ?? true;
  const showSummary = options?.showSummary ?? true;
  const pageSizeOptions = options?.pageSizeOptions ?? DT_DEFAULT_PAGE_SIZE_OPTIONS;

  const pageSizeItems = useMemo(
    () => pageSizeOptions.map((size) => ({ label: String(size), value: size })),
    [pageSizeOptions],
  );

  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize) || 1);
  const from = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalCount);

  const rangeItems = buildPaginationRange(page, pageCount, {
    leadingCount,
    trailingCount,
  });

  const navDisabled = isFetching || totalCount === 0;

  return (
    <div className="flex flex-col items-end gap-3 text-sm md:flex-row md:items-center md:justify-between">
      {showSummary ? (
        <p className="text-right text-muted-foreground md:text-left">
          {totalCount === 0
            ? 'No rows'
            : `Showing ${from}–${to} of ${totalCount}${isFetching ? ' (updating…)' : ''}`}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-end gap-3">
        {showPageSize ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Rows</span>
            <Select
              items={pageSizeItems}
              value={pageSize}
              disabled={navDisabled}
              onValueChange={(value) => {
                if (value != null) {
                  setPageSize(Number(value));
                }
              }}
            >
              <SelectTrigger size="sm" className="w-20 bg-background" aria-label="Rows per page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start" alignItemWithTrigger={false}>
                <SelectGroup>
                  {pageSizeItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        ) : null}

        <nav
          aria-label="Table pagination"
          className="inline-flex overflow-hidden rounded-md border border-border bg-background"
        >
          {showFirstLast ? (
            <PageControl
              aria-label="First page"
              disabled={page <= 1 || navDisabled}
              className="rounded-none"
              onClick={() => setPage(1)}
            >
              <ChevronsLeft className="size-4" />
            </PageControl>
          ) : null}

          <PageControl
            aria-label="Previous page"
            disabled={page <= 1 || navDisabled}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft className="size-4" />
          </PageControl>

          {rangeItems.map((item) => {
            if (item === 'ellipsis-start' || item === 'ellipsis-end') {
              return <PageEllipsis key={item} />;
            }

            return (
              <PageControl
                key={item}
                aria-label={`Page ${item}`}
                active={item === page}
                disabled={navDisabled}
                onClick={() => setPage(item)}
              >
                {item}
              </PageControl>
            );
          })}

          <PageControl
            aria-label="Next page"
            disabled={page >= pageCount || navDisabled}
            className={showFirstLast ? undefined : 'border-r-0'}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight className="size-4" />
          </PageControl>

          {showFirstLast ? (
            <PageControl
              aria-label="Last page"
              disabled={page >= pageCount || navDisabled}
              className="border-r-0"
              onClick={() => setPage(pageCount)}
            >
              <ChevronsRight className="size-4" />
            </PageControl>
          ) : null}
        </nav>
      </div>
    </div>
  );
}

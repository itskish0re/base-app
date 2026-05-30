import { cn } from '@/lib/utils';

type ScreenDataTableSkeletonProps = {
  title?: string;
  columnCount?: number;
  rowCount?: number;
  className?: string;
};

/** Shimmer placeholder for a master screen while screen metadata loads. */
export function ScreenDataTableSkeleton({
  title,
  columnCount = 5,
  rowCount = 5,
  className,
}: ScreenDataTableSkeletonProps) {
  return (
    <div
      className={cn(
        'flex min-h-0 flex-col space-y-0 overflow-hidden rounded-md border p-2 md:p-3',
        className,
      )}
      aria-busy="true"
      aria-label={title ? `Loading ${title}` : 'Loading screen'}
    >
      <div className="flex items-start justify-between gap-3 pb-3">
        {title ? (
          <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        ) : (
          <div className="h-7 w-40 rounded-md ef-shimmer" />
        )}
        <div className="h-8 w-20 shrink-0 rounded-md ef-shimmer" />
      </div>

      <div className="flex flex-wrap items-center gap-2 pb-3">
        <div className="h-9 min-w-[12rem] flex-1 rounded-md ef-shimmer sm:max-w-xs" />
        <div className="h-9 w-9 rounded-md ef-shimmer" />
        <div className="h-9 w-9 rounded-md ef-shimmer" />
      </div>

      <div className="relative min-h-0 w-full flex-1 overflow-hidden rounded-md border">
        <div className="w-full">
          <div className="flex border-b bg-muted px-2 py-2">
            {Array.from({ length: columnCount }).map((_, index) => (
              <div
                key={`head-${index}`}
                className={cn('h-4 rounded-md ef-shimmer', index === columnCount - 1 ? 'w-16' : 'w-24')}
                style={{ flex: index === columnCount - 1 ? '0 0 4rem' : '1 1 0' }}
              />
            ))}
          </div>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex border-b px-2 py-2 last:border-b-0">
              {Array.from({ length: columnCount }).map((_, columnIndex) => (
                <div
                  key={`cell-${rowIndex}-${columnIndex}`}
                  className="h-4 rounded-md ef-shimmer"
                  style={{
                    flex: columnIndex === columnCount - 1 ? '0 0 4rem' : '1 1 0',
                    marginRight: columnIndex < columnCount - 1 ? '0.5rem' : undefined,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-3">
        <div className="h-9 w-28 rounded-md ef-shimmer" />
        <div className="h-9 w-56 rounded-md ef-shimmer" />
      </div>
    </div>
  );
}

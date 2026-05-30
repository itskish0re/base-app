import { cn } from '@/lib/utils';

type EntityFormFieldSkeletonProps = {
  label?: string;
  required?: boolean;
  className?: string;
};

/** Shimmer placeholder matching a single label + control row. */
export function EntityFormFieldSkeleton({
  label,
  required = false,
  className,
}: EntityFormFieldSkeletonProps) {
  return (
    <div className={cn('space-y-2', className)} aria-hidden="true">
      {label ? (
        <div className="text-sm font-medium leading-none">
          {label}
          {required ? (
            <span className="text-destructive" aria-hidden="true">
              {' '}
              *
            </span>
          ) : null}
        </div>
      ) : (
        <div className={cn('h-4 w-28 rounded-md ef-shimmer', className)} />
      )}
      <div className="h-9 w-full rounded-md ef-shimmer" />
    </div>
  );
}

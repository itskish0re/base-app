import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type DtCellOverflowProps = {
  /** Full text shown in the popover when truncated. */
  label: string;
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
};

function alignClass(align: DtCellOverflowProps['align']): string {
  if (align === 'center') {
    return 'text-center';
  }

  if (align === 'right') {
    return 'text-right';
  }

  return 'text-left';
}

export function DtCellOverflow({ label, children, className, align = 'left' }: DtCellOverflowProps) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const measure = useCallback(() => {
    const element = measureRef.current;
    if (!element) {
      return;
    }

    setIsOverflowing(element.scrollWidth > element.clientWidth + 1);
  }, []);

  useEffect(() => {
    measure();
    const element = measureRef.current;
    if (!element) {
      return;
    }

    const observer = new ResizeObserver(measure);
    observer.observe(element);

    return () => observer.disconnect();
  }, [label, measure, children]);

  const content = (
    <div
      ref={measureRef}
      className={cn('min-w-0 max-w-full truncate', alignClass(align), className)}
    >
      {children}
    </div>
  );

  if (!label || !isOverflowing) {
    return content;
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            className={cn(
              'block w-full min-w-0 max-w-full cursor-pointer rounded-sm text-inherit',
              'hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              alignClass(align),
            )}
            aria-label={`View full value: ${label}`}
          />
        }
      >
        {content}
      </PopoverTrigger>
      <PopoverContent className="max-w-md break-words" align="start">
        {label}
      </PopoverContent>
    </Popover>
  );
}

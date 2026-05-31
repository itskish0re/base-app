import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';
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
  /** Optional ref to the truncating element (e.g. badge inner span). */
  measureRef?: RefObject<HTMLElement | null>;
  /** When true, visible content sizes to its children instead of filling the cell width. */
  shrinkWrap?: boolean;
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

export function DtCellOverflow({
  label,
  children,
  className,
  measureRef,
  shrinkWrap = false,
  align = 'left',
}: DtCellOverflowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const measure = useCallback(() => {
    const element = measureRef?.current ?? contentRef.current;
    const container = containerRef.current;
    if (!element) {
      return;
    }

    const elementOverflow = element.scrollWidth > element.clientWidth + 1;
    const containerOverflow =
      container != null && element.scrollWidth > container.clientWidth + 1;

    setIsOverflowing(elementOverflow || containerOverflow);
  }, [measureRef]);

  useEffect(() => {
    measure();

    const observed = new Set<Element>();
    const observer = new ResizeObserver(measure);

    for (const element of [measureRef?.current, contentRef.current, containerRef.current]) {
      if (element && !observed.has(element)) {
        observer.observe(element);
        observed.add(element);
      }
    }

    return () => observer.disconnect();
  }, [label, measure, measureRef]);

  const content = (
    <div
      ref={containerRef}
      className={cn('relative min-w-0 max-w-full', alignClass(align), className)}
    >
      <div
        ref={contentRef}
        className={cn(
          'min-w-0 max-w-full',
          shrinkWrap ? 'inline-block' : 'truncate',
        )}
      >
        {children}
      </div>
    </div>
  );

  if (!label || !isOverflowing) {
    return content;
  }

  return (
    <Popover>
      <PopoverTrigger
        type="button"
        className={cn(
          'min-w-0 max-w-full cursor-pointer rounded-sm border-0 bg-transparent p-0 text-inherit shadow-none',
          shrinkWrap ? 'inline-block' : 'block w-full',
          'hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          alignClass(align),
        )}
        aria-label={`View full value: ${label}`}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {content}
      </PopoverTrigger>
      <PopoverContent className="max-w-md break-words" align="start">
        {label}
      </PopoverContent>
    </Popover>
  );
}

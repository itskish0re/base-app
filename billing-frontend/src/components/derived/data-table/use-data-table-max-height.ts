import { useLayoutEffect, useState, type RefObject } from 'react';
import { DT_VIEWPORT_MAX_HEIGHT_BOTTOM_GAP_PX } from '@/components/derived/data-table/dt-constants';

/** Resolves max height from prop or available viewport space below the table root. */
export function useDataTableMaxHeight(
  rootRef: RefObject<HTMLElement | null>,
  maxHeightProp?: string | number,
): string | undefined {
  const [viewportHeight, setViewportHeight] = useState<string>();

  useLayoutEffect(() => {
    if (maxHeightProp !== undefined) {
      return;
    }

    const update = () => {
      const root = rootRef.current;
      if (!root) {
        return;
      }

      const top = root.getBoundingClientRect().top;
      const available = window.innerHeight - top - DT_VIEWPORT_MAX_HEIGHT_BOTTOM_GAP_PX;
      setViewportHeight(`${Math.max(240, Math.floor(available))}px`);
    };

    update();
    window.addEventListener('resize', update);

    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    if (observer && rootRef.current?.parentElement) {
      observer.observe(rootRef.current.parentElement);
    }

    return () => {
      window.removeEventListener('resize', update);
      observer?.disconnect();
    };
  }, [maxHeightProp, rootRef]);

  if (maxHeightProp !== undefined) {
    return typeof maxHeightProp === 'number' ? `${maxHeightProp}px` : maxHeightProp;
  }

  return viewportHeight;
}

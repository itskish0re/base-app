import { useLayoutEffect, useState, type RefObject } from 'react';

function computeActionsColumnOverlaying(element: HTMLElement): boolean {
  const maxScrollLeft = element.scrollWidth - element.clientWidth;
  if (maxScrollLeft <= 1) {
    return false;
  }

  return element.scrollLeft < maxScrollLeft - 1;
}

/** True when the sticky actions column overlaps scrolled data columns. */
export function useActionsColumnOverlay(
  scrollContainerRef: RefObject<HTMLElement | null>,
  enabled: boolean,
): boolean {
  const [isOverlaying, setIsOverlaying] = useState(false);

  useLayoutEffect(() => {
    if (!enabled) {
      setIsOverlaying(false);
      return;
    }

    const element = scrollContainerRef.current;
    if (!element) {
      return;
    }

    const update = () => {
      setIsOverlaying(computeActionsColumnOverlaying(element));
    };

    update();
    element.addEventListener('scroll', update, { passive: true });

    const observer = new ResizeObserver(update);
    observer.observe(element);

    return () => {
      element.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, [enabled, scrollContainerRef]);

  return isOverlaying;
}

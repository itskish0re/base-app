import { useCallback, useEffect, useRef, useState, type PointerEvent, type WheelEvent } from 'react';

const MIN_SCALE = 0.35;
const MAX_SCALE = 2.5;
const ZOOM_STEP = 0.12;

export type BillPreviewViewportState = {
  scale: number;
  panX: number;
  panY: number;
};

export function useBillPreviewViewport() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState<BillPreviewViewportState>({
    scale: 0.55,
    panX: 0,
    panY: 0,
  });
  const dragRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(
    null,
  );

  const fitToContainer = useCallback(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) {
      return;
    }

    const padding = 24;
    const availableWidth = container.clientWidth - padding;
    const availableHeight = container.clientHeight - padding;
    const contentWidth = content.offsetWidth;
    const contentHeight = content.offsetHeight;

    if (contentWidth <= 0 || contentHeight <= 0) {
      return;
    }

    const scaleX = availableWidth / contentWidth;
    const scaleY = availableHeight / contentHeight;
    const scale = Math.min(scaleX, scaleY, 1);

    setViewport({
      scale: Math.max(MIN_SCALE, Math.min(scale, MAX_SCALE)),
      panX: 0,
      panY: 0,
    });
  }, []);

  const recenter = useCallback(() => {
    setViewport((current) => ({ ...current, panX: 0, panY: 0 }));
  }, []);

  const zoomIn = useCallback(() => {
    setViewport((current) => ({
      ...current,
      scale: Math.min(MAX_SCALE, current.scale + ZOOM_STEP),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setViewport((current) => ({
      ...current,
      scale: Math.max(MIN_SCALE, current.scale - ZOOM_STEP),
    }));
  }, []);

  const resetView = useCallback(() => {
    fitToContainer();
  }, [fitToContainer]);

  useEffect(() => {
    fitToContainer();
  }, [fitToContainer]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const observer = new ResizeObserver(() => {
      fitToContainer();
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [fitToContainer]);

  const onPointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    window.getSelection()?.removeAllRanges();

    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      panX: viewport.panX,
      panY: viewport.panY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }, [viewport.panX, viewport.panY]);

  const onPointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) {
      return;
    }

    event.preventDefault();

    setViewport((current) => ({
      ...current,
      panX: drag.panX + (event.clientX - drag.startX),
      panY: drag.panY + (event.clientY - drag.startY),
    }));
  }, []);

  const endPan = useCallback((event: PointerEvent<HTMLDivElement>) => {
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  const onPointerUp = endPan;
  const onPointerCancel = endPan;

  const onWheel = useCallback((event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    setViewport((current) => ({
      ...current,
      scale: Math.max(MIN_SCALE, Math.min(MAX_SCALE, current.scale + delta)),
    }));
  }, []);

  return {
    containerRef,
    contentRef,
    viewport,
    fitToContainer,
    recenter,
    zoomIn,
    zoomOut,
    resetView,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onWheel,
  };
}

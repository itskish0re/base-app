import { Focus, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BillPreviewModel } from '@/types/billPreview';
import { BillMemoTemplate } from '@/components/transactions/bill/bill-memo-template';
import { useBillPreviewViewport } from '@/components/transactions/bill/use-bill-preview-viewport';
import { cn } from '@/lib/utils';

type BillPreviewCanvasProps = {
  data: BillPreviewModel;
  className?: string;
};

/**
 * A4 bill preview with zoom, pan (drag), recenter, and fit-to-view.
 * Uses CSS transform — not React Flow (which targets node graphs).
 */
export function BillPreviewCanvas({ data, className }: BillPreviewCanvasProps) {
  const {
    containerRef,
    contentRef,
    viewport,
    recenter,
    zoomIn,
    zoomOut,
    resetView,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onWheel,
  } = useBillPreviewViewport();

  return (
    <div
      className={cn(
        'flex h-full min-h-0 flex-col rounded-lg border bg-muted/30',
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-background px-3 py-2">
        <span className="text-xs font-medium text-muted-foreground">Bill preview (A4)</span>
        <div className="flex flex-wrap items-center gap-1">
          <Button type="button" variant="outline" size="sm" onClick={zoomOut} title="Zoom out">
            <ZoomOut className="size-4" />
          </Button>
          <span className="min-w-[3.5rem] text-center text-xs tabular-nums text-muted-foreground">
            {Math.round(viewport.scale * 100)}%
          </span>
          <Button type="button" variant="outline" size="sm" onClick={zoomIn} title="Zoom in">
            <ZoomIn className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={recenter}
            title="Recenter pan"
          >
            <Focus className="size-4" />
            <span className="sr-only">Recenter</span>
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={resetView}>
            Fit
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="bill-preview-canvas__viewport relative flex-1 cursor-grab overflow-hidden select-none touch-none active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onPointerLeave={onPointerUp}
        onWheel={onWheel}
      >
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 origin-center"
          style={{
            transform: `translate(calc(-50% + ${viewport.panX}px), calc(-50% + ${viewport.panY}px)) scale(${viewport.scale})`,
          }}
        >
          <div ref={contentRef} className="shadow-md">
            <BillMemoTemplate data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}

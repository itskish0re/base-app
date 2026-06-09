import { BillPreviewCanvas } from '@/components/transactions/bill/bill-preview-canvas';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/useMobile';
import { cn } from '@/lib/utils';
import type { BillPreviewModel } from '@/types/billPreview';

type BillPreviewSheetProps = {
  data: BillPreviewModel;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function BillPreviewSheet({ data, open, onOpenChange }: BillPreviewSheetProps) {
  const isMobile = useIsMobile();
  const side = isMobile ? 'bottom' : 'right';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        className={cn(
          'flex flex-col gap-0 overflow-hidden p-0',
          side === 'bottom' && 'h-auto max-h-[92vh] rounded-t-xl',
          side === 'right' && '!w-1/2 !max-w-none',
        )}
      >
        <SheetHeader className="border-b border-border bg-card px-4 py-3 sm:px-6">
          <SheetTitle className="text-lg font-semibold tracking-tight">Memo Preview</SheetTitle>
          <SheetDescription className="sr-only">Memo preview for the current bill.</SheetDescription>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col p-3 sm:p-4">
          <BillPreviewCanvas
            data={data}
            className={cn('min-h-0 flex-1', side === 'bottom' ? 'min-h-[55vh]' : 'h-full')}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

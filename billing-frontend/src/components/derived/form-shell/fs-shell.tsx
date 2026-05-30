import type { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/useMobile';
import { cn } from '@/lib/utils';

/** Desktop layout when viewport is not mobile. Mobile always uses a bottom sheet. */
export type FormShellPresentation = 'dialog' | 'sheet';

export type ResponsiveFormShellProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  presentation?: FormShellPresentation;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

function FormShellHeader({
  title,
  description,
  className,
}: Pick<ResponsiveFormShellProps, 'title' | 'description' | 'className'>) {
  return (
    <div className={cn('shrink-0 space-y-1.5 p-4 pb-0 md:p-6 md:pb-0', className)}>
      <h2 className="cn-font-heading text-base font-medium leading-none">{title}</h2>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}

function FormShellBody({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('min-h-0 flex-1 overflow-y-auto p-4 md:p-6', className)}>{children}</div>
  );
}

function FormShellFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'shrink-0 border-t bg-background p-4 md:px-6 md:py-4',
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Renders entity form content in a dialog or sheet.
 * - Mobile: bottom sheet
 * - Desktop + `presentation="dialog"`: centered dialog
 * - Desktop + `presentation="sheet"`: right-side sheet
 */
export function ResponsiveFormShell({
  open,
  onOpenChange,
  title,
  description,
  presentation = 'dialog',
  children,
  footer,
  className,
}: ResponsiveFormShellProps) {
  const isMobile = useIsMobile();
  const useSheet = isMobile || presentation === 'sheet';
  const sheetSide = isMobile ? 'bottom' : 'right';

  if (!useSheet) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton
          className={cn(
            'flex max-h-[min(90vh,720px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg',
            className,
          )}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{title}</DialogTitle>
            {description ? <DialogDescription>{description}</DialogDescription> : null}
          </DialogHeader>
          <FormShellHeader title={title} description={description} />
          <FormShellBody>{children}</FormShellBody>
          {footer ? <FormShellFooter>{footer}</FormShellFooter> : null}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={sheetSide}
        className={cn(
          'flex flex-col gap-0 overflow-hidden p-0',
          sheetSide === 'bottom' && 'max-h-[92vh] rounded-t-xl border-t',
          sheetSide === 'right' && 'w-full sm:max-w-xl',
          className,
        )}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{title}</SheetTitle>
          {description ? <SheetDescription>{description}</SheetDescription> : null}
        </SheetHeader>
        <FormShellHeader title={title} description={description} />
        <FormShellBody>{children}</FormShellBody>
        {footer ? <FormShellFooter>{footer}</FormShellFooter> : null}
      </SheetContent>
    </Sheet>
  );
}

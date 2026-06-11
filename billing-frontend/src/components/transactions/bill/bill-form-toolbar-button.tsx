import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type BillFormToolbarButtonProps = {
  label: string;
  mobileLabel?: string;
  icon: LucideIcon;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive';
  className?: string;
};

/** Toolbar control: icon + label on desktop; icon-only with tooltip on mobile. */
export function BillFormToolbarButton({
  label,
  mobileLabel,
  icon: Icon,
  onClick,
  disabled,
  variant = 'outline',
  className,
}: BillFormToolbarButtonProps) {
  const tooltipLabel = mobileLabel ?? label;

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant={variant}
              size="icon"
              className={cn('size-8 shrink-0 sm:hidden', className)}
              aria-label={tooltipLabel}
              disabled={disabled}
              onClick={onClick}
            />
          }
        >
          <Icon className="size-3.5" />
        </TooltipTrigger>
        <TooltipContent>{tooltipLabel}</TooltipContent>
      </Tooltip>

      <Button
        type="button"
        variant={variant}
        size="sm"
        className={cn(
          'hidden h-9 shrink-0 px-4 text-sm sm:inline-flex',
          variant === 'default' && 'px-4',
          className,
        )}
        disabled={disabled}
        onClick={onClick}
      >
        <Icon className="size-4" />
        {label}
      </Button>
    </>
  );
}

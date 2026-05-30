import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export type DtActionIconButtonProps = {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'ghost' | 'destructive' | 'outline' | 'secondary';
  className?: string;
};

/** Icon-only row/header action with accessible label and tooltip. */
export function DtActionIconButton({
  label,
  icon: Icon,
  onClick,
  disabled,
  variant = 'ghost',
  className,
}: DtActionIconButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant={variant}
          size="icon"
          className={cn('size-8 shrink-0', className)}
          aria-label={label}
          disabled={disabled}
          onClick={onClick}
        >
          <Icon className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

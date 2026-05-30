import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export type DtActionToggleSwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  enabledLabel?: string;
  disabledLabel?: string;
};

/** Row enable/disable control with tooltip (not an icon button). */
export function DtActionToggleSwitch({
  checked,
  onCheckedChange,
  disabled,
  enabledLabel = 'Enabled',
  disabledLabel = 'Disabled',
}: DtActionToggleSwitchProps) {
  const label = checked ? enabledLabel : disabledLabel;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex items-center px-1">
          <Switch
            checked={checked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
            aria-label={label}
          />
        </span>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

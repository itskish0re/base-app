import type { LucideIcon } from 'lucide-react';
import { Pencil, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { DtActionIconButton } from '@/components/derived/data-table/dt-action-button';
import { DtActionToggleSwitch } from '@/components/derived/data-table/dt-action-toggle';
import {
  DT_ACTION_ICON_WIDTH_PX,
  DT_ACTION_ITEM_GAP_PX,
  DT_ACTION_SWITCH_WIDTH_PX,
} from '@/components/derived/data-table/dt-column-layout';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';

export type DataTableRowActionRenderContext = {
  /** True when any row mutation is in flight. */
  disabled: boolean;
};

export type DataTableRowActionItem = {
  id: string;
  inlineWidthPx: number;
  hidden?: boolean;
  renderInline: (ctx: DataTableRowActionRenderContext) => ReactNode;
  renderMenu: (ctx: DataTableRowActionRenderContext) => ReactNode;
};

export function estimateRowActionsInlineMinWidthPx(items: DataTableRowActionItem[]): number {
  const visibleItems = items.filter((item) => !item.hidden);

  if (visibleItems.length === 0) {
    return DT_ACTION_ICON_WIDTH_PX;
  }

  return visibleItems.reduce(
    (width, item, index) => width + (index > 0 ? DT_ACTION_ITEM_GAP_PX : 0) + item.inlineWidthPx,
    0,
  );
}

type RowActionIconOptions = {
  id?: string;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
  destructive?: boolean;
};

function rowActionIcon({
  id,
  label,
  icon: Icon,
  onClick,
  disabled,
  destructive,
}: RowActionIconOptions): DataTableRowActionItem {
  return {
    id: id ?? label.toLowerCase().replace(/\s+/g, '-'),
    inlineWidthPx: DT_ACTION_ICON_WIDTH_PX,
    renderInline: ({ disabled: globalDisabled }) => (
      <DtActionIconButton
        label={label}
        icon={Icon}
        disabled={globalDisabled || disabled}
        className={
          destructive ? 'text-destructive hover:bg-destructive/10 hover:text-destructive' : undefined
        }
        onClick={onClick}
      />
    ),
    renderMenu: ({ disabled: globalDisabled }) => (
      <DropdownMenuItem
        disabled={globalDisabled || disabled}
        className={
          destructive ? 'text-destructive focus:bg-destructive/10 focus:text-destructive' : undefined
        }
        onClick={onClick}
      >
        <Icon />
        {label}
      </DropdownMenuItem>
    ),
  };
}

type RowActionEditOptions = {
  id?: string;
  label?: string;
  onClick: () => void;
  disabled?: boolean;
};

export function rowActionEdit({
  id = 'edit',
  label = 'Edit',
  onClick,
  disabled,
}: RowActionEditOptions): DataTableRowActionItem {
  return rowActionIcon({ id, label, icon: Pencil, onClick, disabled });
}

type RowActionDeleteOptions = {
  id?: string;
  label?: string;
  onClick: () => void;
  disabled?: boolean;
};

export function rowActionDelete({
  id = 'delete',
  label = 'Delete',
  onClick,
  disabled,
}: RowActionDeleteOptions): DataTableRowActionItem {
  return rowActionIcon({ id, label, icon: Trash2, onClick, disabled, destructive: true });
}

type RowActionToggleOptions = {
  id?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  enabledLabel?: string;
  disabledLabel?: string;
};

export function rowActionToggle({
  id = 'toggle',
  checked,
  onCheckedChange,
  disabled,
  enabledLabel = 'Enabled',
  disabledLabel = 'Disabled',
}: RowActionToggleOptions): DataTableRowActionItem {
  const label = checked ? enabledLabel : disabledLabel;

  return {
    id,
    inlineWidthPx: DT_ACTION_SWITCH_WIDTH_PX,
    renderInline: ({ disabled: globalDisabled }) => (
      <DtActionToggleSwitch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={globalDisabled || disabled}
        enabledLabel={enabledLabel}
        disabledLabel={disabledLabel}
      />
    ),
    renderMenu: ({ disabled: globalDisabled }) => (
      <DropdownMenuItem
        disabled={globalDisabled || disabled}
        className="flex items-center justify-between gap-3"
        onSelect={(event) => event.preventDefault()}
      >
        <span>{label}</span>
        <Switch
          checked={checked}
          disabled={globalDisabled || disabled}
          aria-label={label}
          onCheckedChange={onCheckedChange}
        />
      </DropdownMenuItem>
    ),
  };
}

type RowActionCustomOptions = {
  id: string;
  inlineWidthPx: number;
  hidden?: boolean;
  renderInline: (ctx: DataTableRowActionRenderContext) => ReactNode;
  renderMenu: (ctx: DataTableRowActionRenderContext) => ReactNode;
};

export function rowActionCustom(options: RowActionCustomOptions): DataTableRowActionItem {
  return options;
}

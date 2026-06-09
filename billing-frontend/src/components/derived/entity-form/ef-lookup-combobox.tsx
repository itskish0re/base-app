import { useMemo, type ReactNode } from 'react';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import type { LookupItem } from '@/types/common';

type EntityFormLookupComboboxProps = {
  id?: string;
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur?: () => void;
  disabled?: boolean;
  clearable?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  items: LookupItem[];
  isLoading?: boolean;
  isError?: boolean;
  addonBeforeTrigger?: ReactNode;
};

function lookupItemValue(item: LookupItem): string {
  return String(item.value ?? '');
}

function lookupItemLabel(item: LookupItem): string {
  const label = item.label;
  if (label == null || label === '') {
    return lookupItemValue(item);
  }

  return String(label);
}

function lookupItemSearchText(item: LookupItem): string {
  const parts = [lookupItemLabel(item), lookupItemValue(item)];

  for (const fieldValue of Object.values(item.fields ?? {})) {
    if (fieldValue != null && fieldValue !== '') {
      parts.push(String(fieldValue));
    }
  }

  return parts.join(' ').toLowerCase();
}

export function EntityFormLookupCombobox({
  id,
  value,
  onChange,
  onBlur,
  disabled = false,
  clearable = true,
  placeholder = 'Select…',
  emptyMessage = 'No matches found.',
  items,
  isLoading = false,
  isError = false,
  addonBeforeTrigger,
}: EntityFormLookupComboboxProps) {
  const selectedValue = value == null || value === '' ? null : String(value);

  const selectedItem = useMemo(
    () => items.find((item) => lookupItemValue(item) === selectedValue) ?? null,
    [items, selectedValue],
  );

  const comboboxDisabled = disabled || isLoading;

  return (
    <Combobox
      items={items}
      value={selectedItem}
      onValueChange={(item) => {
        if (item == null) {
          onChange(null);
          return;
        }

        onChange(Number(lookupItemValue(item)));
      }}
      onOpenChange={(open) => {
        if (!open) {
          onBlur?.();
        }
      }}
      itemToStringLabel={lookupItemLabel}
      isItemEqualToValue={(item, selected) =>
        lookupItemValue(item) === lookupItemValue(selected)
      }
      filter={(item, query) => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) {
          return true;
        }

        return lookupItemSearchText(item).includes(normalizedQuery);
      }}
      disabled={comboboxDisabled}
    >
      <ComboboxInput
        id={id}
        placeholder={isLoading ? 'Loading options…' : placeholder}
        showClear={clearable && selectedItem != null}
        disabled={comboboxDisabled}
        aria-invalid={isError || undefined}
        addonBeforeTrigger={addonBeforeTrigger}
      />
      <ComboboxContent>
        {isError ? (
          <p className="px-3 py-2 text-sm text-destructive">Failed to load options.</p>
        ) : isLoading ? (
          <p className="px-3 py-2 text-sm text-muted-foreground">Loading options…</p>
        ) : (
          <>
            <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
            <ComboboxList>
              {(item) => {
                const itemValue = lookupItemValue(item);
                const secondary =
                  item.fields?.code != null ? String(item.fields.code) : null;

                return (
                  <ComboboxItem key={itemValue} value={item}>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{lookupItemLabel(item)}</span>
                      {secondary ? (
                        <span className="block truncate font-mono text-xs uppercase text-muted-foreground">
                          {secondary}
                        </span>
                      ) : null}
                    </span>
                  </ComboboxItem>
                );
              }}
            </ComboboxList>
          </>
        )}
      </ComboboxContent>
    </Combobox>
  );
}

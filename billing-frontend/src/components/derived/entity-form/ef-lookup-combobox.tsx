import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { LookupItem } from '@/types/common';

type EntityFormLookupComboboxProps = {
  id?: string;
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur?: () => void;
  disabled?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  items: LookupItem[];
  isLoading?: boolean;
  isError?: boolean;
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

function filterLookupItems(items: LookupItem[], search: string): LookupItem[] {
  const query = search.trim().toLowerCase();
  if (!query) {
    return items;
  }

  return items.filter((item) => lookupItemSearchText(item).includes(query));
}

export function EntityFormLookupCombobox({
  id,
  value,
  onChange,
  onBlur,
  disabled = false,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  emptyMessage = 'No matches found.',
  items,
  isLoading = false,
  isError = false,
}: EntityFormLookupComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedValue = value == null || value === '' ? null : String(value);

  const selectedItem = useMemo(
    () => items.find((item) => lookupItemValue(item) === selectedValue) ?? null,
    [items, selectedValue],
  );

  const filteredItems = useMemo(() => filterLookupItems(items, search), [items, search]);

  const triggerLabel = selectedItem ? lookupItemLabel(selectedItem) : placeholder;

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setSearch('');
          onBlur?.();
        }
      }}
    >
      <PopoverTrigger
        id={id}
        disabled={disabled}
        className={cn(
          'inline-flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors',
          'hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:cursor-not-allowed disabled:opacity-50',
          !selectedItem && 'text-muted-foreground',
        )}
      >
        <span className="truncate text-left">{triggerLabel}</span>
        <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[var(--anchor-width)] gap-2 p-2" align="start">
        <Input
          value={search}
          placeholder={searchPlaceholder}
          autoComplete="off"
          onChange={(event) => setSearch(event.target.value)}
        />
        <div className="max-h-60 overflow-y-auto rounded-md border">
          {isLoading ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">Loading options…</p>
          ) : isError ? (
            <p className="px-3 py-2 text-sm text-destructive">Failed to load options.</p>
          ) : filteredItems.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">{emptyMessage}</p>
          ) : (
            filteredItems.map((item) => {
              const itemValue = lookupItemValue(item);
              const isSelected = itemValue === selectedValue;
              const secondary = item.fields?.code != null ? String(item.fields.code) : null;

              return (
                <Button
                  key={itemValue}
                  type="button"
                  variant="ghost"
                  className={cn(
                    'h-auto w-full justify-start gap-2 rounded-none px-3 py-2 text-left font-normal',
                    isSelected && 'bg-accent',
                  )}
                  onClick={() => {
                    onChange(Number(itemValue));
                    setOpen(false);
                    setSearch('');
                  }}
                >
                  <CheckIcon
                    className={cn('size-4 shrink-0', isSelected ? 'opacity-100' : 'opacity-0')}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{lookupItemLabel(item)}</span>
                    {secondary ? (
                      <span className="block truncate font-mono text-xs uppercase text-muted-foreground">
                        {secondary}
                      </span>
                    ) : null}
                  </span>
                </Button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

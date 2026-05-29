import { Columns3, ListFilter } from 'lucide-react';
import { useDataTable } from '@/components/derived/data-table/hooks';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export function DtToolbarOptions() {
  const {
    columns,
    columnVisibility,
    showColumnSearch,
    setColumnVisibility,
    toggleShowColumnSearch,
    clearColumnFilters,
  } = useDataTable();

  const visibleCount = columns.filter((column) => columnVisibility[column.id] !== false).length;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" size="icon" aria-label="Show or hide columns">
                  <Columns3 className="size-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>Show / hide columns</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="start" className="w-52">
            <DropdownMenuLabel>Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {columns.length === 0 ? (
              <p className="px-2 py-1.5 text-sm text-muted-foreground">No columns</p>
            ) : (
              columns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={columnVisibility[column.id] !== false}
                  onCheckedChange={(checked) => {
                    const nextVisible = checked === true;
                    if (visibleCount <= 1 && !nextVisible) {
                      return;
                    }
                    setColumnVisibility(column.id, nextVisible);
                  }}
                  onSelect={(event) => event.preventDefault()}
                >
                  {column.header}
                </DropdownMenuCheckboxItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={showColumnSearch ? 'secondary' : 'outline'}
              size="icon"
              aria-label="Toggle column search"
              aria-pressed={showColumnSearch}
              className={cn(showColumnSearch && 'bg-secondary')}
              onClick={() => {
                if (showColumnSearch) {
                  clearColumnFilters();
                }
                toggleShowColumnSearch();
              }}
            >
              <ListFilter className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Column search</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

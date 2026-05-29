import { Search } from 'lucide-react';
import { useDataTable } from '@/components/derived/data-table/hooks';
import { Input } from '@/components/ui/input';

export type DtToolbarSearchProps = {
  placeholder?: string;
};

export function DtToolbarSearch({ placeholder = 'Search…' }: DtToolbarSearchProps) {
  const { tableState, setGlobalFilter } = useDataTable();

  return (
    <div className="relative w-full min-w-[12rem] max-w-md">
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={tableState.filter.global}
        placeholder={placeholder}
        className="pl-8"
        onChange={(event) => setGlobalFilter(event.target.value)}
      />
    </div>
  );
}

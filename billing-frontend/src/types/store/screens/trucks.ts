import type { DataTableState } from '@/components/derived/data-table';
import type { ScreenMetadataState } from '@/types/store/screen';

export interface TrucksScreenState {
  table: DataTableState;
  metadata: ScreenMetadataState;
}

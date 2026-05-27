import type { ScreenMetadataState } from '@/types/store/screen';

export interface TrucksScreenState {
  filter: string;
  page: number;
  selectedId: number | null;
  metadata: ScreenMetadataState;
}

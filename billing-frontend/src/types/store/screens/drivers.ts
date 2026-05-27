import type { ScreenMetadataState } from '@/types/store/screen';

export interface DriversScreenState {
  filter: string;
  page: number;
  selectedId: number | null;
  metadata: ScreenMetadataState;
}

import type { ScreenMetadataState } from '@/types/store/screen';

export interface NameBoardsScreenState {
  filter: string;
  page: number;
  pageSize: number;
  selectedId: number | null;
  metadata: ScreenMetadataState;
}

import type { EntityScreenMetadataDto } from '@/types/store/screen/entity';
import type { ScreenMetadataDto } from '@/types/store/screen/screen';

export const SCREEN_METADATA_LOAD_STATUS = {
  idle: 'idle',
  loading: 'loading',
  succeeded: 'succeeded',
  failed: 'failed',
} as const;

export type ScreenMetadataLoadStatus =
  (typeof SCREEN_METADATA_LOAD_STATUS)[keyof typeof SCREEN_METADATA_LOAD_STATUS];

/** Screen metadata held in a per-route Redux slice (from GET /api/screens/by-menu/{menuCode}). */
export interface ScreenMetadataState {
  status: ScreenMetadataLoadStatus;
  error: string | null;
  screen: ScreenMetadataDto | null;
  entities: EntityScreenMetadataDto[];
}

export function createInitialScreenMetadataState(): ScreenMetadataState {
  return {
    status: SCREEN_METADATA_LOAD_STATUS.idle,
    error: null,
    screen: null,
    entities: [],
  };
}

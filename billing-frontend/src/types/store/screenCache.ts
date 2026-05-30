import type { ScreenKeyWithMetadata } from '@/store/screens/screenMetadataActions';
import type { ScreenMetadataState } from '@/types/store/screen';

/** Persisted per-screen registry data (metadata; lookups later). Survives route unmount. */
export type ScreenCacheState = {
  metadataByScreenKey: Partial<Record<ScreenKeyWithMetadata, ScreenMetadataState>>;
};

export function createInitialScreenCacheState(): ScreenCacheState {
  return {
    metadataByScreenKey: {},
  };
}

import { SCREEN_KEYS, type ScreenKey } from '@/constants/screenKeys';

/** Master screens that load registry metadata into the global screen cache. */
export type ScreenKeyWithMetadata =
  | typeof SCREEN_KEYS.nameBoard
  | typeof SCREEN_KEYS.truck;

const SCREEN_KEYS_WITH_METADATA = new Set<ScreenKeyWithMetadata>([
  SCREEN_KEYS.nameBoard,
  SCREEN_KEYS.truck,
]);

export function isScreenKeyWithMetadata(key: ScreenKey): key is ScreenKeyWithMetadata {
  return SCREEN_KEYS_WITH_METADATA.has(key as ScreenKeyWithMetadata);
}

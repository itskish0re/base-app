import { SCREEN_KEYS, type ScreenKey } from '@/constants/screenKeys';

/** Master screens that load registry metadata into the global screen cache. */
export type ScreenKeyWithMetadata =
  | typeof SCREEN_KEYS.nameBoard
  | typeof SCREEN_KEYS.truck
  | typeof SCREEN_KEYS.location
  | typeof SCREEN_KEYS.party
  | typeof SCREEN_KEYS.goods
  | typeof SCREEN_KEYS.unit
  | typeof SCREEN_KEYS.financialYear
  | typeof SCREEN_KEYS.bills;

const SCREEN_KEYS_WITH_METADATA = new Set<ScreenKeyWithMetadata>([
  SCREEN_KEYS.nameBoard,
  SCREEN_KEYS.truck,
  SCREEN_KEYS.location,
  SCREEN_KEYS.party,
  SCREEN_KEYS.goods,
  SCREEN_KEYS.unit,
  SCREEN_KEYS.financialYear,
  SCREEN_KEYS.bills,
]);

export function isScreenKeyWithMetadata(key: ScreenKey): key is ScreenKeyWithMetadata {
  return SCREEN_KEYS_WITH_METADATA.has(key as ScreenKeyWithMetadata);
}

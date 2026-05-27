import { SCREEN_KEYS, type ScreenKey } from '@/constants/screenKeys';
import { driversScreenActions } from '@/store/screens/driversSlice';
import { nameBoardsScreenActions } from '@/store/screens/nameBoardsSlice';
import { trucksScreenActions } from '@/store/screens/trucksSlice';

/** Master screens that load registry metadata into their slice. */
export const screenMetadataActionsByKey = {
  [SCREEN_KEYS.nameBoard]: nameBoardsScreenActions,
  [SCREEN_KEYS.truck]: trucksScreenActions,
  [SCREEN_KEYS.driver]: driversScreenActions,
} as const;

export type ScreenKeyWithMetadata = keyof typeof screenMetadataActionsByKey;

export function isScreenKeyWithMetadata(key: ScreenKey): key is ScreenKeyWithMetadata {
  return key in screenMetadataActionsByKey;
}

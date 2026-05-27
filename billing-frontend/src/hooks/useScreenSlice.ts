import { useEffect } from 'react';
import type { ScreenKey } from '@/constants/screenKeys';
import { useAppSelector } from '@/store/hooks';
import {
  injectScreenReducer,
  removeScreenReducer,
} from '@/store/store';
import { screenReducerRegistry } from '@/store/screens/registry';
import type { ScreenStateByKey } from '@/types/store/screens';
import type { RootState } from '@/types/store/root';

/**
 * Mounts a screen's Redux slice while the page is mounted; removes it on unmount
 * so inactive screens do not keep state in memory.
 */
export function useScreenSlice<K extends ScreenKey>(screenKey: K): void {
  useEffect(() => {
    injectScreenReducer(screenKey, screenReducerRegistry[screenKey]);

    return () => {
      removeScreenReducer(screenKey);
    };
  }, [screenKey]);
}

export function useScreenSelector<K extends ScreenKey, TSelected>(
  screenKey: K,
  selector: (state: ScreenStateByKey[K]) => TSelected,
): TSelected {
  useScreenSlice(screenKey);

  return useAppSelector((root: RootState) => {
    const sliceState = root[screenKey] as ScreenStateByKey[K] | undefined;
    if (!sliceState) {
      throw new Error(`Screen slice "${screenKey}" is not mounted.`);
    }

    return selector(sliceState);
  });
}

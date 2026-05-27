import { useLayoutEffect } from 'react';
import type { ScreenKey } from '@/constants/screenKeys';
import { useAppSelector } from '@/store/hooks';
import { screenReducerRegistry } from '@/store/screens/registry';
import { screenMountActionsByKey } from '@/store/screens/screenMountActions';
import {
  injectScreenReducer,
  isScreenReducerMounted,
  removeScreenReducer,
  store,
} from '@/store/store';
import type { ScreenStateByKey } from '@/types/store/screens';
import type { RootState } from '@/types/store/root';

/**
 * Mounts a screen's Redux slice while the page is mounted; removes it on unmount
 * so inactive screens do not keep state in memory.
 */
export function useScreenSlice<K extends ScreenKey>(screenKey: K): void {
  useLayoutEffect(() => {
    if (!isScreenReducerMounted(screenKey)) {
      injectScreenReducer(screenKey, screenReducerRegistry[screenKey]);
      store.dispatch(screenMountActionsByKey[screenKey]());
    }

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

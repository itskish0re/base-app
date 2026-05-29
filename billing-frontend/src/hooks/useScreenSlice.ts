import { useLayoutEffect } from 'react';
import { shallowEqual } from 'react-redux';
import type { ScreenKey } from '@/constants/screenKeys';
import { useAppSelector } from '@/store/hooks';
import { screenReducerRegistry } from '@/store/screens/registry';
import { screenMountActionsByKey } from '@/store/screens/screenMountActions';
import type { ScreenKeyWithMetadata } from '@/store/screens/screenMetadataActions';
import {
  injectScreenReducer,
  isScreenReducerMounted,
  removeScreenReducer,
  store,
} from '@/store/store';
import type { ScreenKeyWithTable, ScreenStateByKey } from '@/types/store/screens';
import type { RootState } from '@/types/store/root';

/**
 * Registers the screen reducer and seeds state before any selector runs.
 * Must be synchronous — `useLayoutEffect` alone runs after the first render.
 */
export function ensureScreenSliceMounted<K extends ScreenKey>(screenKey: K): void {
  if (!isScreenReducerMounted(screenKey)) {
    injectScreenReducer(screenKey, screenReducerRegistry[screenKey]);
    store.dispatch(screenMountActionsByKey[screenKey]());
  }
}

/**
 * Mounts a screen's Redux slice while the page is mounted; removes it on unmount
 * so inactive screens do not keep state in memory.
 */
export function useScreenSlice<K extends ScreenKey>(screenKey: K): void {
  ensureScreenSliceMounted(screenKey);

  useLayoutEffect(() => {
    return () => {
      removeScreenReducer(screenKey);
    };
  }, [screenKey]);
}

export function useScreenSelector<K extends ScreenKey, TSelected>(
  screenKey: K,
  selector: (state: ScreenStateByKey[K]) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean,
): TSelected {
  useScreenSlice(screenKey);

  return useAppSelector((root: RootState) => {
    const sliceState = root[screenKey] as ScreenStateByKey[K] | undefined;
    if (!sliceState) {
      throw new Error(`Screen slice "${screenKey}" is not mounted.`);
    }

    return selector(sliceState);
  }, equalityFn);
}

/** Select `table` from a screen slice (shallow-equal to avoid redundant rerenders). */
export function useScreenTableSelector<K extends ScreenKeyWithTable>(screenKey: K) {
  return useScreenSelector(screenKey, (state) => state.table, shallowEqual);
}

/** Select `metadata` from a screen slice (shallow-equal to avoid redundant rerenders). */
export function useScreenMetadataSelector<K extends ScreenKeyWithMetadata>(screenKey: K) {
  return useScreenSelector(screenKey, (state) => state.metadata, shallowEqual);
}

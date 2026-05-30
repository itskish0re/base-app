import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { ScreenKey } from '@/constants/screenKeys';
import { screenByMenuQueryOptions } from '@/service/query/screens';
import { isQueryAbortError } from '@/service/query/query-errors';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCurrentMenuCode } from '@/store/global/menuSlice';
import {
  screenMetadataActionsByKey,
  type ScreenKeyWithMetadata,
} from '@/store/screens/screenMetadataActions';
import { ensureScreenSliceMounted } from '@/hooks/useScreenSlice';
import {
  SCREEN_METADATA_LOAD_STATUS,
  createInitialScreenMetadataState,
  type ScreenMetadataState,
} from '@/types/store/screen';
import type { ScreenStateByKey } from '@/types/store/screens';

const FALLBACK_SCREEN_METADATA = createInitialScreenMetadataState();

function resolveMenuCode(
  screenKey: ScreenKey,
  currentMenuCode: string | null,
  menuCodeOverride?: string,
): string | null {
  const code = menuCodeOverride ?? currentMenuCode ?? screenKey;
  return code.trim() ? code.trim() : null;
}

function metadataErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Failed to load screen metadata';
}

export type UseScreenMetadataOptions = {
  /** Defaults to the current sidebar menu's `menu_code`. */
  menuCode?: string;
  /** When false, skips fetch and Redux updates. Default true. */
  enabled?: boolean;
};

export type UseScreenMetadataResult = {
  menuCode: string | null;
  metadata: ScreenMetadataState;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
};

/**
 * Loads screen metadata from GET /api/screens/by-menu/{menuCode} into the screen slice.
 * Call {@link useScreenSlice} first on the page (or rely on {@link ensureScreenSliceMounted} here).
 */
export function useScreenMetadata<K extends ScreenKeyWithMetadata>(
  screenKey: K,
  options: UseScreenMetadataOptions = {},
): UseScreenMetadataResult {
  const { menuCode: menuCodeOverride, enabled = true } = options;

  ensureScreenSliceMounted(screenKey);

  const dispatch = useAppDispatch();
  const currentMenuCode = useAppSelector(selectCurrentMenuCode);
  const menuCode = resolveMenuCode(screenKey, currentMenuCode, menuCodeOverride);
  const actions = screenMetadataActionsByKey[screenKey];
  const sliceMounted = useAppSelector(
    (state) => (state[screenKey] as ScreenStateByKey[K] | undefined) !== undefined,
  );

  const query = useQuery({
    ...screenByMenuQueryOptions(menuCode ?? ''),
    enabled: enabled && Boolean(menuCode) && sliceMounted,
  });

  useEffect(() => {
    if (!enabled || !menuCode || !sliceMounted) {
      return;
    }

    if (query.data) {
      dispatch(actions.setScreenMetadataSucceeded(query.data));
    }

    if (query.isError && !isQueryAbortError(query.error)) {
      if (!query.data) {
        dispatch(actions.setScreenMetadataFailed(metadataErrorMessage(query.error)));
      }
      return;
    }

    if (!query.data && (query.isPending || query.isFetching)) {
      dispatch(actions.setScreenMetadataLoading());
    }
  }, [
    actions,
    dispatch,
    enabled,
    menuCode,
    query.data,
    query.error,
    query.isError,
    query.isFetching,
    query.isPending,
    sliceMounted,
  ]);

  const metadata = useAppSelector((state) => {
    const slice = state[screenKey] as ScreenStateByKey[K] | undefined;
    return slice?.metadata ?? FALLBACK_SCREEN_METADATA;
  });

  const hasMetadata = metadata.status === SCREEN_METADATA_LOAD_STATUS.succeeded;

  return {
    menuCode,
    metadata,
    isLoading: !sliceMounted || (query.isPending && !hasMetadata),
    isError: metadata.status === SCREEN_METADATA_LOAD_STATUS.failed,
    error: query.error,
    refetch: query.refetch,
  };
}

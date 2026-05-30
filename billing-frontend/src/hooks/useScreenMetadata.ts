import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { ScreenKey } from '@/constants/screenKeys';
import { queryKeys } from '@/constants/queryKeys';
import { screenByMenuQueryOptions } from '@/service/query/screens';
import { isQueryAbortError } from '@/service/query/query-errors';
import {
  screenCacheActions,
  selectScreenMetadataState,
} from '@/store/global/screenCacheSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCurrentMenuCode } from '@/store/global/menuSlice';
import type { ScreenKeyWithMetadata } from '@/store/screens/screenMetadataActions';
import {
  SCREEN_METADATA_LOAD_STATUS,
  createInitialScreenMetadataState,
  type ScreenMetadataState,
} from '@/types/store/screen';

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
 * Loads screen metadata from GET /api/screens/by-menu/{menuCode} into the global screen cache.
 * Cached metadata survives in-app navigation; a hard browser reload clears the cache and refetches.
 */
export function useScreenMetadata<K extends ScreenKeyWithMetadata>(
  screenKey: K,
  options: UseScreenMetadataOptions = {},
): UseScreenMetadataResult {
  const { menuCode: menuCodeOverride, enabled = true } = options;

  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const currentMenuCode = useAppSelector(selectCurrentMenuCode);
  const menuCode = resolveMenuCode(screenKey, currentMenuCode, menuCodeOverride);

  const metadata = useAppSelector((state) => selectScreenMetadataState(state, screenKey));
  const hasCachedMetadata = metadata.status === SCREEN_METADATA_LOAD_STATUS.succeeded;

  const query = useQuery({
    ...screenByMenuQueryOptions(menuCode ?? ''),
    enabled: enabled && Boolean(menuCode) && !hasCachedMetadata,
  });

  useEffect(() => {
    if (!enabled || !menuCode || hasCachedMetadata) {
      return;
    }

    if (query.data) {
      dispatch(
        screenCacheActions.setScreenMetadataSucceeded({
          screenKey,
          data: query.data,
        }),
      );
      return;
    }

    if (query.isError && !isQueryAbortError(query.error)) {
      dispatch(
        screenCacheActions.setScreenMetadataFailed({
          screenKey,
          error: metadataErrorMessage(query.error),
        }),
      );
      return;
    }

    if (query.isPending || query.isFetching) {
      dispatch(screenCacheActions.setScreenMetadataLoading({ screenKey }));
    }
  }, [
    dispatch,
    enabled,
    hasCachedMetadata,
    menuCode,
    query.data,
    query.error,
    query.isError,
    query.isFetching,
    query.isPending,
    screenKey,
  ]);

  const refetch = () => {
    dispatch(screenCacheActions.clearScreenMetadata({ screenKey }));
    if (menuCode) {
      void queryClient.invalidateQueries({ queryKey: queryKeys.screens.byMenu(menuCode) });
    }
  };

  return {
    menuCode,
    metadata: metadata ?? FALLBACK_SCREEN_METADATA,
    isLoading: !hasCachedMetadata && (query.isPending || metadata.status === SCREEN_METADATA_LOAD_STATUS.loading),
    isError: metadata.status === SCREEN_METADATA_LOAD_STATUS.failed,
    error: query.error,
    refetch,
  };
}

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouterState } from '@tanstack/react-router';
import { navigationQueryOptions } from '@/service/query/access';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setCurrentMenuFromPath,
  setMenusFailed,
  setMenusLoading,
  setMenusSucceeded,
} from '@/store/global/menuSlice';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Failed to load menus';
}

/**
 * Fetches navigation via service/query, hydrates menu slice, and syncs currentMenu to the URL.
 */
export function useMenuBootstrap(): void {
  const dispatch = useAppDispatch();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  const navigationQuery = useQuery(
    navigationQueryOptions({ enabled: isAuthenticated }),
  );

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    if (navigationQuery.isPending) {
      dispatch(setMenusLoading());
      return;
    }

    if (navigationQuery.isError) {
      dispatch(setMenusFailed(getErrorMessage(navigationQuery.error)));
      return;
    }

    if (navigationQuery.isSuccess && navigationQuery.data) {
      dispatch(setMenusSucceeded(navigationQuery.data.menus));
    }
  }, [
    dispatch,
    isAuthenticated,
    navigationQuery.isPending,
    navigationQuery.isError,
    navigationQuery.isSuccess,
    navigationQuery.data,
    navigationQuery.error,
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    dispatch(setCurrentMenuFromPath(pathname));
  }, [dispatch, isAuthenticated, pathname]);
}

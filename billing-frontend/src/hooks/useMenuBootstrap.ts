import { useEffect } from 'react';
import { useRouterState } from '@tanstack/react-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMenus, setCurrentMenuFromPath } from '@/store/menuSlice';

/**
 * Loads navigation menus into Redux when authenticated and keeps currentMenu in sync with the URL.
 */
export function useMenuBootstrap(): void {
  const dispatch = useAppDispatch();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const status = useAppSelector((s) => s.menu.status);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    if (status === 'idle' || status === 'failed') {
      void dispatch(fetchMenus());
    }
  }, [dispatch, isAuthenticated, status]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    dispatch(setCurrentMenuFromPath(pathname));
  }, [dispatch, isAuthenticated, pathname, status]);
}

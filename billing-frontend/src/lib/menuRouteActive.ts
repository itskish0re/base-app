import { useRouterState } from '@tanstack/react-router';
import { DASHBOARD_ROUTE } from '@/constants/routes';

function normalizePath(path: string): string {
  if (!path || path === '/') {
    return '/';
  }

  return path.replace(/\/+$/, '');
}

export function isMenuRouteActive(pathname: string, routePath: string): boolean {
  const current = normalizePath(pathname);
  const target = normalizePath(routePath);

  if (target === '/' || target === DASHBOARD_ROUTE) {
    return current === '/' || current === DASHBOARD_ROUTE;
  }

  return current === target || current.startsWith(`${target}/`);
}

export function useMenuRouteActive(routePath: string): boolean {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return isMenuRouteActive(pathname, routePath);
}

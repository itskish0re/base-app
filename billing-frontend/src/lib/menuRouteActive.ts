import { useRouterState } from '@tanstack/react-router';
import { DASHBOARD_ROUTE, ROUTES } from '@/constants/routes';

/** List routes that have their own sidebar entries under the same URL prefix. */
const EXACT_MATCH_MENU_ROUTES = new Set<string>([ROUTES.bills]);

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

  if (EXACT_MATCH_MENU_ROUTES.has(target)) {
    return current === target;
  }

  return current === target || current.startsWith(`${target}/`);
}

export function useMenuRouteActive(routePath: string): boolean {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return isMenuRouteActive(pathname, routePath);
}

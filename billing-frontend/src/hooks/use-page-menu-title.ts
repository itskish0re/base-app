import { useQuery } from '@tanstack/react-query';
import { useRouterState } from '@tanstack/react-router';
import { navigationQueryOptions } from '@/api/queries/navigation';
import type { NavigationMenu } from '@/types/auth';

function menuMatchesPath(menu: NavigationMenu, pathname: string): boolean {
  const path = menu.routePath;
  if (path === '/') {
    return pathname === '/';
  }

  return pathname === path || pathname.startsWith(`${path}/`);
}

export function findMenuForPath(
  menus: NavigationMenu[],
  pathname: string,
): NavigationMenu | undefined {
  return [...menus]
    .sort((a, b) => b.routePath.length - a.routePath.length)
    .find((menu) => menuMatchesPath(menu, pathname));
}

export function usePageMenuTitle(fallback = 'Billing'): string {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data } = useQuery(navigationQueryOptions());

  const menu = data?.menus ? findMenuForPath(data.menus, pathname) : undefined;
  return menu?.displayName ?? fallback;
}

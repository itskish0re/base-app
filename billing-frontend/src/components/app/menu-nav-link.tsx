import { Link } from '@tanstack/react-router';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { DASHBOARD_ROUTE } from '@/constants/routes';

function isExternalPath(path: string): boolean {
  return /^https?:\/\//i.test(path) || path.startsWith('mailto:');
}

type MenuNavLinkProps = ComponentPropsWithoutRef<'a'> & {
  routePath: string;
};

/**
 * In-app paths use TanStack Router (client navigation).
 * External URLs use a normal anchor.
 */
export const MenuNavLink = forwardRef<HTMLAnchorElement, MenuNavLinkProps>(function MenuNavLink(
  { routePath, children, ...props },
  ref,
) {
  if (isExternalPath(routePath)) {
    return (
      <a ref={ref} href={routePath} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link
      ref={ref}
      to={routePath as '/'}
      activeOptions={{
        exact: routePath === DASHBOARD_ROUTE,
        includeSearch: false,
      }}
      activeProps={{
        'data-active': true,
        'aria-current': 'page',
      }}
      {...props}
    >
      {children}
    </Link>
  );
});

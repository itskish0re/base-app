import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { MenuNavLink } from '@/components/app/menu-nav-link';
import { useMenuRouteActive } from '@/lib/menuRouteActive';
import { menuTooltip } from '@/lib/navigationTree';
import { resolveMenuIcon } from '@/lib/menu-icons';
import type { NavigationMenu } from '@/types/access';

const SECTION_LABEL = 'Secondary';

function NavSecondaryItem({ menu }: { menu: NavigationMenu }) {
  const active = useMenuRouteActive(menu.routePath);
  const Icon = resolveMenuIcon(menu.icon);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        render={<MenuNavLink routePath={menu.routePath} />}
        size="sm"
        tooltip={menuTooltip(menu)}
        isActive={active}
      >
        <Icon />
        <span>{menu.displayName}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function NavSecondary({
  items = [],
  className,
  ...props
}: React.ComponentProps<typeof SidebarGroup> & { items?: NavigationMenu[] }) {
  const roots = items
    .filter((m) => m.parentMenuId === null)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (roots.length === 0) {
    return null;
  }

  return (
    <SidebarGroup className={className} {...props}>
      <SidebarGroupLabel>{SECTION_LABEL}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {roots.map((menu) => (
            <NavSecondaryItem key={menu.menuId} menu={menu} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

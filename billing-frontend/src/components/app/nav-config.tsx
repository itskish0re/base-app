import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { MenuNavLink } from '@/components/app/menu-nav-link';
import { useMenuRouteActive } from '@/lib/menuRouteActive';
import { menuTooltip } from '@/lib/navigationTree';
import { resolveMenuIcon } from '@/lib/menu-icons';
import { cn } from '@/lib/utils';
import type { NavigationMenu } from '@/types/access';

const SECTION_LABEL = 'Config';

function NavConfigItem({ item }: { item: NavigationMenu }) {
  const active = useMenuRouteActive(item.routePath);
  const Icon = resolveMenuIcon(item.icon);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        render={<MenuNavLink routePath={item.routePath} />}
        tooltip={menuTooltip(item)}
        isActive={active}
      >
        <Icon />
        <span>{item.displayName}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function NavConfig({
  items,
  className,
}: {
  items: NavigationMenu[];
  className?: string;
}) {
  const roots = items
    .filter((m) => m.parentMenuId === null)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (roots.length === 0) {
    return null;
  }

  return (
    <SidebarGroup className={cn('group-data-[collapsible=icon]:hidden', className)}>
      <SidebarGroupLabel>{SECTION_LABEL}</SidebarGroupLabel>
      <SidebarMenu>
        {roots.map((item) => (
          <NavConfigItem key={item.menuId} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

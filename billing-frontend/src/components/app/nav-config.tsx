import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { MenuNavLink } from '@/components/app/menu-nav-link';
import { menuTooltip } from '@/lib/navigation-tree';
import { resolveMenuIcon } from '@/lib/menu-icons';
import type { NavigationMenu } from '@/types/auth';

const SECTION_LABEL = 'Config';

export function NavConfig({ items }: { items: NavigationMenu[] }) {
  const roots = items
    .filter((m) => m.parentMenuId === null)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (roots.length === 0) {
    return null;
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{SECTION_LABEL}</SidebarGroupLabel>
      <SidebarMenu>
        {roots.map((item) => {
          const Icon = resolveMenuIcon(item.icon);
          return (
            <SidebarMenuItem key={item.menuId}>
              <SidebarMenuButton asChild tooltip={menuTooltip(item)}>
                <MenuNavLink routePath={item.routePath}>
                  <Icon />
                  <span>{item.displayName}</span>
                </MenuNavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

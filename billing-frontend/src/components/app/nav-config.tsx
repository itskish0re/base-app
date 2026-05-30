import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { MenuNavLink } from '@/components/app/menu-nav-link';
import { menuTooltip } from '@/lib/navigationTree';
import { resolveMenuIcon } from '@/lib/menu-icons';
import { cn } from '@/lib/utils';
import type { NavigationMenu } from '@/types/access';

const SECTION_LABEL = 'Config';

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
        {roots.map((item) => {
          const Icon = resolveMenuIcon(item.icon);
          return (
            <SidebarMenuItem key={item.menuId}>
              <SidebarMenuButton
                render={<MenuNavLink routePath={item.routePath} />}
                tooltip={menuTooltip(item)}
              >
                <Icon />
                <span>{item.displayName}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

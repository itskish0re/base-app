import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { MenuNavLink } from '@/components/app/menu-nav-link';
import { menuTooltip } from '@/lib/navigationTree';
import { resolveMenuIcon } from '@/lib/menu-icons';
import type { NavigationMenu } from '@/types/auth';

const SECTION_LABEL = 'Secondary';

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
          {roots.map((menu) => {
            const Icon = resolveMenuIcon(menu.icon);
            return (
              <SidebarMenuItem key={menu.menuId}>
                <SidebarMenuButton asChild size="sm" tooltip={menuTooltip(menu)}>
                  <MenuNavLink routePath={menu.routePath}>
                    <Icon />
                    <span>{menu.displayName}</span>
                  </MenuNavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

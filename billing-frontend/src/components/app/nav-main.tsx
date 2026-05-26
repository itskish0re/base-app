import { useRouterState } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { MenuNavLink } from '@/components/app/menu-nav-link';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { menuTooltip, type NavigationMenuNode } from '@/lib/navigation-tree';
import { resolveMenuIcon } from '@/lib/menu-icons';

function isRouteActive(pathname: string, routePath: string): boolean {
  if (routePath === '/') {
    return pathname === '/';
  }

  return pathname === routePath || pathname.startsWith(`${routePath}/`);
}

function NavSubLink({ menu }: { menu: NavigationMenuNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = isRouteActive(pathname, menu.routePath);

  return (
    <SidebarMenuSubButton asChild isActive={active}>
      <MenuNavLink routePath={menu.routePath}>
        <span>{menu.displayName}</span>
      </MenuNavLink>
    </SidebarMenuSubButton>
  );
}

function NavMainItem({ item }: { item: NavigationMenuNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const Icon = resolveMenuIcon(item.icon);
  const tooltip = menuTooltip(item);
  const hasChildren = item.children.length > 0;
  const childActive = item.children.some((c) => isRouteActive(pathname, c.routePath));
  const active = isRouteActive(pathname, item.routePath);

  if (!hasChildren) {
    const content = (
      <>
        <Icon />
        <span>{item.displayName}</span>
      </>
    );

    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip={tooltip} isActive={active}>
          <MenuNavLink routePath={item.routePath}>{content}</MenuNavLink>
        </SidebarMenuButton>
        {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible asChild defaultOpen={item.defaultExpanded || childActive} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={tooltip} isActive={active || childActive}>
            <Icon />
            <span>{item.displayName}</span>
            {item.badge ? <SidebarMenuBadge className="right-8">{item.badge}</SidebarMenuBadge> : null}
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children.map((child) => (
              <SidebarMenuSubItem key={child.menuId}>
                <NavSubLink menu={child} />
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

const SECTION_LABEL = 'Main';

export function NavMain({
  items,
  isLoading,
  isError,
}: {
  items: NavigationMenuNode[];
  isLoading?: boolean;
  isError?: boolean;
}) {
  if (!isLoading && !isError && items.length === 0) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{SECTION_LABEL}</SidebarGroupLabel>
      <SidebarMenu>
        {isLoading && (
          <p className="px-2 py-1.5 text-sm text-muted-foreground">Loading menus…</p>
        )}
        {isError && (
          <p className="px-2 py-1.5 text-sm text-destructive">Could not load navigation.</p>
        )}
        {!isLoading && !isError && items.map((item) => (
          <NavMainItem key={item.menuId} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

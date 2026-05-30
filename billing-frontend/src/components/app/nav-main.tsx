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
import { menuTooltip, type NavigationMenuNode } from '@/lib/navigationTree';
import { resolveMenuIcon } from '@/lib/menu-icons';

function isRouteActive(pathname: string, routePath: string): boolean {
  return pathname === routePath || pathname.startsWith(`${routePath}/`);
}

function NavSubLink({ menu }: { menu: NavigationMenuNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = isRouteActive(pathname, menu.routePath);

  return (
    <SidebarMenuSubButton render={<MenuNavLink routePath={menu.routePath} />} isActive={active}>
      <span>{menu.displayName}</span>
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
        <SidebarMenuButton
          render={<MenuNavLink routePath={item.routePath} />}
          tooltip={tooltip}
          isActive={active}
        >
          {content}
        </SidebarMenuButton>
        {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <Collapsible defaultOpen={item.defaultExpanded || childActive} className="group/collapsible">
        <CollapsibleTrigger
          render={<SidebarMenuButton tooltip={tooltip} isActive={active || childActive} />}
        >
          <Icon />
          <span>{item.displayName}</span>
          {item.badge ? <SidebarMenuBadge className="right-8">{item.badge}</SidebarMenuBadge> : null}
          <ChevronRight className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
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
      </Collapsible>
    </SidebarMenuItem>
  );
}

const SECTION_LABEL = 'Main';

export function NavMain({
  items,
  isError,
}: {
  items: NavigationMenuNode[];
  isError?: boolean;
}) {
  if (!isError && items.length === 0) {
    return null;
  }

  const showLabel = items.length > 0;

  return (
    <SidebarGroup>
      {showLabel ? <SidebarGroupLabel>{SECTION_LABEL}</SidebarGroupLabel> : null}
      <SidebarMenu>
        {isError && (
          <p className="px-2 py-1.5 text-sm text-destructive">Could not load navigation.</p>
        )}
        {!isError && items.map((item) => (
          <NavMainItem key={item.menuId} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

import { useQuery } from '@tanstack/react-query';
import { Command } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { navigationQueryOptions } from '@/api/queries/navigation';
import { NavConfig } from '@/components/app/nav-config';
import { NavMain } from '@/components/app/nav-main';
import { NavSecondary } from '@/components/app/nav-secondary';
import { NavUser } from '@/components/app/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { buildNavigationTree, partitionNavigationMenus } from '@/lib/navigation-tree';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data, isLoading, isError } = useQuery(navigationQueryOptions());
  const sections = data?.menus
    ? partitionNavigationMenus(data.menus)
    : partitionNavigationMenus([]);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Billing</span>
                  <span className="truncate text-xs">Masters</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain
          items={buildNavigationTree(sections.main.menus)}
          isLoading={isLoading}
          isError={isError}
        />
        <NavConfig items={sections.config.menus} />
        <NavSecondary items={sections.secondary.menus} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

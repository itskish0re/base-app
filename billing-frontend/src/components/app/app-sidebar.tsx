import { Command } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useAppSelector } from '@/store/hooks';
import { MENU_LOAD_STATUS } from '@/constants/menu';
import { selectMenuLoadStatus, selectMenuSections } from '@/store/global/menuSlice';
import { NavConfig } from '@/components/app/nav-config';
import { NavMain } from '@/components/app/nav-main';
import { NavSecondary } from '@/components/app/nav-secondary';
import { NavUser } from '@/components/app/nav-user';
import { SidebarNavSkeleton } from '@/components/app/sidebar-nav-skeleton';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { buildNavigationTree } from '@/lib/navigationTree';
import { DASHBOARD_ROUTE } from '@/constants/routes';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const sections = useAppSelector(selectMenuSections);
  const status = useAppSelector(selectMenuLoadStatus);
  const isLoading =
    status === MENU_LOAD_STATUS.idle || status === MENU_LOAD_STATUS.loading;
  const isError = status === MENU_LOAD_STATUS.failed;

  return (
    <Sidebar variant="inset" collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link to={DASHBOARD_ROUTE} />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Command className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Billing</span>
                <span className="truncate text-xs">Masters</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {isLoading ? (
          <SidebarNavSkeleton />
        ) : (
          <>
            <NavMain
              items={buildNavigationTree(sections.main.menus)}
              isError={isError}
            />
            <NavSecondary items={sections.secondary.menus} />
            <NavConfig items={sections.config.menus} className="mt-auto" />
          </>
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

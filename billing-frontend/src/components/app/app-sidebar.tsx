import { useAppSelector } from '@/store/hooks';
import { MENU_LOAD_STATUS } from '@/constants/menu';
import { selectMenuLoadStatus, selectMenuSections } from '@/store/global/menuSlice';
import { NavConfig } from '@/components/app/nav-config';
import { NavMain } from '@/components/app/nav-main';
import { NavSecondary } from '@/components/app/nav-secondary';
import { NavUser } from '@/components/app/nav-user';
import { FinancialYearSwitcher } from '@/components/app/financial-year-switcher';
import { SidebarNavSkeleton } from '@/components/app/sidebar-nav-skeleton';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { buildNavigationTree } from '@/lib/navigationTree';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const sections = useAppSelector(selectMenuSections);
  const status = useAppSelector(selectMenuLoadStatus);
  const isLoading =
    status === MENU_LOAD_STATUS.idle || status === MENU_LOAD_STATUS.loading;
  const isError = status === MENU_LOAD_STATUS.failed;

  return (
    <Sidebar variant="inset" collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <FinancialYearSwitcher />
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

import { Outlet } from '@tanstack/react-router';
import { AppSidebar } from '@/components/app/app-sidebar';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useMenuBootstrap } from '@/hooks/useMenuBootstrap';
import { useFinancialYearBootstrap } from '@/hooks/useFinancialYearContext';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentMenuTitle } from '@/store/global/menuSlice';

export function AppShell() {
  useMenuBootstrap();
  useFinancialYearBootstrap();
  const pageTitle = useAppSelector(selectCurrentMenuTitle);

  return (
    <TooltipProvider delay={0}>
      <SidebarProvider className="h-svh max-h-svh overflow-hidden">
        <AppSidebar />
        <SidebarInset className="min-h-0 overflow-hidden">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <span className="text-sm font-medium">{pageTitle}</span>
            </div>
          </header>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4 pt-0">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}

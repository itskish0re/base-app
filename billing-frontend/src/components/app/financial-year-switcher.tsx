import { Calendar, ChevronsUpDown, CreditCard } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { DASHBOARD_ROUTE } from '@/constants/routes';
import { useFinancialYearSelection } from '@/hooks/useFinancialYearContext';
import { useAppSelector } from '@/store/hooks';
import {
  selectFinancialYearContextStatus,
  selectFinancialYearOptions,
  selectSelectedFinancialYear,
} from '@/store/global/financialYearContextSlice';
import { FINANCIAL_YEAR_CONTEXT_LOAD_STATUS } from '@/types/store/global/financialYearContext';

export function FinancialYearSwitcher() {
  const { isMobile } = useSidebar();
  const status = useAppSelector(selectFinancialYearContextStatus);
  const options = useAppSelector(selectFinancialYearOptions);
  const selected = useAppSelector(selectSelectedFinancialYear);
  const selectFinancialYear = useFinancialYearSelection();

  const isLoading = status === FINANCIAL_YEAR_CONTEXT_LOAD_STATUS.loading;
  const financialYearName = selected?.name ?? selected?.code ?? 'Select financial year';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                disabled={isLoading || options.length === 0}
              />
            }
          >
            <Link
              to={DASHBOARD_ROUTE}
              activeOptions={{ exact: true }}
              onClick={(event) => event.stopPropagation()}
              className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
            >
              <CreditCard className="size-4" />
            </Link>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Billing</span>
              {isLoading ? (
                <div className="mt-0.5 h-3.5 w-32 max-w-full rounded-md ef-shimmer" />
              ) : (
                <span className="truncate font-mono text-xs text-muted-foreground">
                  {financialYearName}
                </span>
              )}
            </div>
            <ChevronsUpDown className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Financial years
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {options.map((option) => (
              <DropdownMenuItem
                key={option.financialYearId}
                onClick={() => selectFinancialYear(option)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <Calendar className="size-3.5 shrink-0" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{option.name}</span>
                  <span className="truncate font-mono text-xs text-muted-foreground">
                    {option.code}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

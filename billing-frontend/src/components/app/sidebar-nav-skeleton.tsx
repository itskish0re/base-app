import { Skeleton } from '@/components/ui/skeleton';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

function MenuItemSkeleton() {
  return (
    <SidebarMenuItem>
      <div className="flex h-8 items-center gap-2 rounded-md px-2">
        <Skeleton className="size-4 shrink-0" />
        <Skeleton className="h-4 flex-1" />
      </div>
    </SidebarMenuItem>
  );
}

function NavGroupSkeleton({ label, count = 3 }: { label: string; count?: number }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {Array.from({ length: count }).map((_, index) => (
          <MenuItemSkeleton key={index} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function SidebarNavSkeleton() {
  return (
    <>
      <NavGroupSkeleton label="Main" count={1} />
      <NavGroupSkeleton label="Secondary" count={3} />
      <div className="mt-auto">
        <NavGroupSkeleton label="Config" count={1} />
      </div>
    </>
  );
}

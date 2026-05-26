import {
  Circle,
  Home,
  LayoutDashboard,
  PanelLeft,
  Settings,
  Truck,
  User,
  Users,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  home: Home,
  dashboard: LayoutDashboard,
  layoutdashboard: LayoutDashboard,
  panelleft: PanelLeft,
  settings: Settings,
  truck: Truck,
  user: User,
  users: Users,
  nameboard: PanelLeft,
  nameboards: PanelLeft,
  driver: User,
  drivers: Users,
};

export function resolveMenuIcon(icon: string | null | undefined): LucideIcon {
  if (!icon) {
    return Circle;
  }

  const key = icon.replace(/[-_\s]/g, '').toLowerCase();
  return iconMap[key] ?? Circle;
}

import {
  Circle,
  Calendar,
  Home,
  LayoutDashboard,
  MapPin,
  Package,
  PanelLeft,
  Ruler,
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
  mappin: MapPin,
  location: MapPin,
  package: Package,
  goods: Package,
  ruler: Ruler,
  unit: Ruler,
  calendar: Calendar,
  financialyear: Calendar,
};

export function resolveMenuIcon(icon: string | null | undefined): LucideIcon {
  if (!icon) {
    return Circle;
  }

  const key = icon.replace(/[-_\s]/g, '').toLowerCase();
  return iconMap[key] ?? Circle;
}

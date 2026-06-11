import {
  Circle,
  Calendar,
  FilePenLine,
  FilePlus,
  Home,
  LayoutDashboard,
  MapPin,
  Package,
  PanelLeft,
  Receipt,
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
  receipt: Receipt,
  bills: Receipt,
  fileplus: FilePlus,
  filepen: FilePenLine,
  filepenline: FilePenLine,
};

export function resolveMenuIcon(icon: string | null | undefined): LucideIcon {
  if (!icon) {
    return Circle;
  }

  const key = icon.replace(/[-_\s]/g, '').toLowerCase();
  return iconMap[key] ?? Circle;
}

/** Sidebar navigation row from GET /api/access/navigation. */
export interface NavigationMenu {
  menuId: number;
  menuCode: string;
  displayName: string;
  routePath: string;
  icon: string | null;
  parentMenuId: number | null;
  sortOrder: number;
  badge: string | null;
  tooltip: string | null;
  defaultExpanded: boolean;
  menuGroup: string;
}

export interface NavigationResponse {
  menus: NavigationMenu[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
}

export interface NavigationMenu {
  menuId: number;
  menuCode: string;
  displayName: string;
  routePath: string;
  icon: string | null;
  parentMenuId: number | null;
  sortOrder: number;
  /** Shown on the menu button when the sidebar is collapsed (defaults to displayName). */
  badge: string | null;
  tooltip: string | null;
  /** Whether a parent menu with children starts expanded. */
  defaultExpanded: boolean;
  /** Sidebar section: main | secondary | config */
  menuGroup: string;
}

export interface NavigationResponse {
  menus: NavigationMenu[];
}

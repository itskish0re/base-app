import { MENU_GROUP_ORDER, MENU_GROUPS, type MenuGroup } from '@/constants/menu';
import type { NavigationMenu } from '@/types/access';

export type NavigationMenuNode = NavigationMenu & {
  children: NavigationMenuNode[];
};

export type NavigationSection = {
  menuGroup: string;
  menus: NavigationMenu[];
};

export type NavigationSections = {
  main: NavigationSection;
  secondary: NavigationSection;
  config: NavigationSection;
};

function normalizeMenuGroup(menuGroup: string | undefined | null): MenuGroup {
  const value = menuGroup?.trim().toLowerCase();
  if (value === MENU_GROUPS.secondary) {
    return MENU_GROUPS.secondary;
  }

  if (value === MENU_GROUPS.config || value === 'projects') {
    return MENU_GROUPS.config;
  }

  return MENU_GROUPS.main;
}

function emptySection(menuGroup: MenuGroup): NavigationSection {
  return { menuGroup, menus: [] };
}

export function partitionNavigationMenus(menus: NavigationMenu[]): NavigationSections {
  const grouped = new Map<string, NavigationMenu[]>();

  for (const menu of menus) {
    const group = normalizeMenuGroup(menu.menuGroup);
    const list = grouped.get(group) ?? [];
    list.push(menu);
    grouped.set(group, list);
  }

  const sections: NavigationSections = {
    main: emptySection(MENU_GROUPS.main),
    secondary: emptySection(MENU_GROUPS.secondary),
    config: emptySection(MENU_GROUPS.config),
  };

  for (const key of MENU_GROUP_ORDER) {
    sections[key] = {
      menuGroup: key,
      menus: grouped.get(key) ?? [],
    };
  }

  return sections;
}

export function buildNavigationTree(menus: NavigationMenu[]): NavigationMenuNode[] {
  const roots = menus
    .filter((m) => m.parentMenuId === null)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return roots.map((root) => ({
    ...root,
    children: menus
      .filter((m) => m.parentMenuId === root.menuId)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((child) => ({ ...child, children: [] })),
  }));
}

export function menuTooltip(menu: NavigationMenu): string {
  return menu.tooltip?.trim() || menu.displayName;
}

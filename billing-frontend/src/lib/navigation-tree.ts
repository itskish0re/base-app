import type { NavigationMenu } from '@/types/auth';

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

const GROUP_ORDER = ['main', 'secondary', 'config'] as const;

function normalizeMenuGroup(menuGroup: string | undefined | null): (typeof GROUP_ORDER)[number] {
  const value = menuGroup?.trim().toLowerCase();
  if (value === 'secondary') {
    return 'secondary';
  }

  if (value === 'config' || value === 'projects') {
    return 'config';
  }

  return 'main';
}

function emptySection(menuGroup: (typeof GROUP_ORDER)[number]): NavigationSection {
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
    main: emptySection('main'),
    secondary: emptySection('secondary'),
    config: emptySection('config'),
  };

  for (const key of GROUP_ORDER) {
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

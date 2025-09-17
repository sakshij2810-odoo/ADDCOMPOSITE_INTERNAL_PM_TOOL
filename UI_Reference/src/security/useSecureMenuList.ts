import React from "react";
import { appNavbarMenuData, INavbarMenu, INavbarMenuItem } from "src/layouts/config-nav-main-app";
import { useAuthContext } from "src/auth/hooks";

export const useSecureMenuList = () => {
  const { accessibleModules } = useAuthContext();

  // Extract accessible module keys
  const accessibleModuleIds = React.useMemo(() => {
    return accessibleModules.filter((mod) => mod.show_module === 1).map((mod) => mod.module_key);
  }, [accessibleModules]);

  // Filter menu items based on module access
  const filterMenuItems = (items: INavbarMenuItem[]): INavbarMenuItem[] => {
    return items.map((item) => {
      const filteredChildren = item.children ? filterMenuItems(item.children).filter((child) => child.allowFullAccess || child.modules.some((id) => accessibleModuleIds.includes(id))) : [];

      return {
        ...item,
        children: filteredChildren.length > 0 ? filteredChildren : undefined,
      };
    }).filter((item) => item.allowFullAccess || item.modules.some((id) => accessibleModuleIds.includes(id)) || (item.children && item.children.length > 0));
  };

  // Filter top-level menus
  const filterMenus = (menus: INavbarMenu[]): INavbarMenu[] => {
    return menus.map((menu) => ({
      ...menu,
      items: filterMenuItems(menu.items),
    })).filter((menu) => menu.items.length > 0);
  };

  return React.useMemo(() => {
    return filterMenus(appNavbarMenuData);
  }, [accessibleModuleIds]);

};

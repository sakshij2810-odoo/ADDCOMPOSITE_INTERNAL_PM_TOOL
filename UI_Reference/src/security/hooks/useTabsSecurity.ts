import { ReactNode, useEffect, useMemo, useState } from "react";
import { useAuthContext } from "src/auth/hooks"
import { useRouter } from "src/routes/hooks";
import { main_app_routes } from "src/routes/paths";

export interface ITab {
    value: string,
    label: string,
    icon?: string | React.ReactElement,
    module: string
}

interface ITabsWithSecurity extends ITab {
    isVisible: boolean
}

export const useTabsSecurity = (tabs: ITab[]): ITabsWithSecurity[] => {
    const { accessibleModules } = useAuthContext();
    const router = useRouter();

    const accessibleTabs = useMemo(() => tabs.map((tab) => {
        const isExist = accessibleModules.find((module) => module.module_key === tab.module)
        return {
            ...tab,
            isVisible: isExist ? Boolean(isExist["show_module"]) : false
        }
    }).filter((tab) => tab.isVisible), [tabs, accessibleModules])

    if (accessibleTabs.length === 0) {
        router.push(main_app_routes.errors.error403)
    }

    return accessibleTabs
}
import { IconifyIcon } from "@iconify/react";

export interface IMenuOption {
    icon: string;
    label: string;
    disabled?: boolean;
    onClick?: () => void;
}

export interface IContextMenuProps {
    menuOptions: IMenuOption[];
}
import { SxProps } from "@mui/material";
import { Theme } from "@mui/system";
import React from "react";

export interface IRightPanelProps {
    open: boolean;
    heading: string;
    subHeading?: string;
    isWrappedWithForm?: boolean;
    onFormSubmit?: () => void;
    actionButtons?: () => React.ReactNode;
    children?: React.ReactNode;
    onClose: () => void;
    width?: string;
    hideScroll?: boolean;
    paperSx?: SxProps<Theme>
    drawerProps?: SxProps<Theme>
}
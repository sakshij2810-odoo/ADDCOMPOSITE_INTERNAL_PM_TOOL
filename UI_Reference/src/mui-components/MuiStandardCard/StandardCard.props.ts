import { SxProps } from "@mui/material";
import { Theme } from "@mui/material/styles";

export interface IStandardCardProps {
    title?: string | React.ReactNode;
    subTitle?: string;
    rightHeading?: string | React.ReactNode;
    divider?: boolean
    sx?: SxProps<Theme>;
    children?: React.ReactNode;
    variant?: "normal" | "tabsOnly"
    background?: "normal" | "lightergray"
}
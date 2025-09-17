import { ChipProps, Theme } from "@mui/material";
import { SxProps } from "@mui/system";

export interface ICustomChipProps {
  size: "small" | "medium";
  content: string | React.ReactNode;
  sx?: SxProps<Theme>;
  icon?: React.ReactNode;
  color: ChipProps["color"];
}

/* eslint-disable spaced-comment */
import { Chip } from "@mui/material";
import React from "react";
import { ICustomChipProps } from "./interfaces/ICustomChipProps";

export const CustomChip: React.FC<ICustomChipProps> = (props) => {
  const { size, content, color, icon, sx } = props;
  return (
    <Chip
      sx={{
        color: "#fff",
        borderRadius: "6px",
        pl: "3px",
        pr: "3px",
        ...sx,
      }}
      //@ts-ignore
      icon={icon}
      color={color}
      size={size}
      label={content}
    />
  );
};

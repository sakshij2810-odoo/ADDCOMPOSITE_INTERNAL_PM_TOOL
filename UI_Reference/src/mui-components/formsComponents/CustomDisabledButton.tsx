import React from "react";
import { styled } from "@mui/material/styles";
import { Button, ButtonProps } from "@mui/material";

export const CustomDisabledButton = styled((props: ButtonProps) => (
  <Button {...props} />
))(({ theme }) => ({
  backgroundColor: `${
    theme.palette.mode === "dark" ? "rgba(73,82,88,0.12)" : "#ecf0f3"
  }`,
}));

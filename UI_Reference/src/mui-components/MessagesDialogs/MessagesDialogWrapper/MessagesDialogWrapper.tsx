import { Stack } from "@mui/material";
import React from "react";

export const MessagesDialogWrapper: React.FC<{ children: React.ReactNode }> = (
  props,
) => {
  return (
    <Stack direction={"row"} spacing={1}>
      {props.children}
    </Stack>
  );
};

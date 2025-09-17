import { Refresh } from "@mui/icons-material";
import React from "react";
import { IRefreshPluginsProps } from "./interfaces/IRefreshPluginProps";
import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

export const RefreshPlugin: React.FC<IRefreshPluginsProps> = (props) => {
  const { onClick } = props;

  return (
    <Tooltip title='Refresh Data'>
    <Button variant="text" sx={{ minWidth: "fit-content" }} onClick={onClick}>
      <Refresh color="primary" />
    </Button>
    </Tooltip>
  );
};

/* eslint-disable react/jsx-curly-brace-presence */
import React from "react";

import Tooltip from "@mui/material/Tooltip";
import { Refresh } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";

import type { IDataTableV2RefreshPlugin } from "./DataTableV2Refresh.types";

export const DatatableV2Refresh: React.FC<IDataTableV2RefreshPlugin> = (
  props
) => {
  const { onClick } = props;

  return (
    <Box width={'fit-content'}>
      <Tooltip title="Refresh Data">
        <Button variant="text" onClick={onClick}>
          <Stack direction={"row"} spacing={1} alignItems={"center"}>
            <Refresh sx={{ color: "#637381", fontSize: 25 }} />
            <Typography variant="body1" fontSize={'1rem'} fontWeight={600} sx={{ color: "#637381" }}>
              Refresh
            </Typography>{" "}
          </Stack>
        </Button>
      </Tooltip>
    </Box>
  );
};

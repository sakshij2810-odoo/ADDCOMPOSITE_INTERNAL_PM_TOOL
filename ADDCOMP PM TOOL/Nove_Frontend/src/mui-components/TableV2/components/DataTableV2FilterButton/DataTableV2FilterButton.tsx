import React from "react";

import { Button, Stack, Typography } from "@mui/material";

import type { IDataTableV2FilterButtonProps } from "./DataTableV2FilterButton.types";

export const DataTableV2FilterButton: React.FC<
  IDataTableV2FilterButtonProps
> = ({ icon, id, label, onClick }) => {
  const IconComponent = icon;

  return (
    <Button
      variant="text"
      aria-describedby={`custom-${id}`}
      onClick={onClick}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <IconComponent color="primary" sx={{ fontSize: 25 }} />
        <Typography
          variant="body1"
          fontSize="1.2rem"
          fontWeight={600}
          color="primary.main"
        >
          {label}
        </Typography>
      </Stack>
    </Button>
  );
};

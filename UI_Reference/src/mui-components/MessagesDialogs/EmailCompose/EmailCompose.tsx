import React from "react";
import { Box, Typography } from "@mui/material";

import { IEmailComposeRightPanelProps } from "./EmailCompose.types";
import { EmailOutlined } from "@mui/icons-material";
import { EmailComposeDialog } from "./EmailComposeDialog";

export const EmailComposeRightPanel: React.FC<IEmailComposeRightPanelProps> = (
  props,
) => {
  const { toEmail, displayLabel, id } = props;
  const [open, setOpen] = React.useState(false);

  const handleToggleOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      <Box
        display={"flex"}
        sx={{ cursor: "pointer" }}
        onClick={handleToggleOpen}
      >
        <EmailOutlined color="primary" fontSize="small" />
        <Typography variant="body1" marginLeft={1}>
          {displayLabel}
        </Typography>
      </Box>
      {open && (
        <EmailComposeDialog
          open={open}
          onClose={handleToggleOpen}
          toEmail={toEmail}
        />
      )}
    </>
  );
};

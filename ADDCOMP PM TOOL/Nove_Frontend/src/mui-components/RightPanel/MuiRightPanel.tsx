/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-curly-brace-presence */
import React from "react";

import { Box, Divider, Drawer, IconButton, Stack, Typography, useTheme } from "@mui/material";

import { IRightPanelProps } from "./interfaces/IRightPanelProps";
import { Iconify } from "src/components/iconify";

export const MuiRightPanel: React.FC<IRightPanelProps> = (props) => {
  const {
    open,
    heading,
    isWrappedWithForm = false,
    onFormSubmit,

    subHeading,
    actionButtons,
    width,
    onClose,
    hideScroll = false,
    drawerProps,
    paperSx,
  } = props;

  const theme = useTheme();


  const renderHead = (
    <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        {heading}
      </Typography>



      <IconButton onClick={onClose} >
        <Iconify icon="mingcute:close-line" />
      </IconButton>
    </Stack>
  );

  const content = () => {
    return (
      <Box
        display="flex"
        flexDirection={"column"}
        justifyContent="space-between"
        height={"100%"}
        onClick={(e) => e.stopPropagation()}
      >
        {/* <Box flex={1}>
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            mb={2}
            sx={{
              padding: "25px 20px",
              backgroundColor: theme.palette.secondary.main,
            }}
          >
            <Typography variant="h2" fontWeight={"bold"} color="#fff">
              {heading}
            </Typography>
            <Box sx={{ cursor: "pointer" }} onClick={onClose}>
              <Close sx={{ color: '#fff' }} />
            </Box>
          </Box>
        </Box> */}
        {/* {subHeading && (
          <CustomTypography variant="body1">{subHeading}</CustomTypography>
        )} */}
        <Box
          flex={10}
          sx={{
            overflowY: hideScroll ? "hidden" : "auto",
            padding: "0px 20px",
            pr: hideScroll ? "0px" : "20px",
          }}
        >
          {props.children}
        </Box>
        {actionButtons && (
          <>
            <Divider sx={{ marginBottom: 2 }} />
            <Box flex={1} sx={{ padding: "0px 20px", }}>
              {actionButtons}
            </Box>
          </>
        )}
      </Box>
    );
  };
  const wrappedWithForm = () => {
    if (isWrappedWithForm && onFormSubmit) {
      return (
        <form onSubmit={onFormSubmit} style={{ height: "100%" }}>
          {content()}
        </form>
      );
    }
    return content();
  };

  return (
    <Drawer
      open={open}
      // onClose={onClose}
      anchor="right"
      slotProps={{ backdrop: { invisible: true } }}
      PaperProps={{
        sx: {
          width: {
            xs: "100%",
            md: "50%",
            lg: width || "35%"
          },
          // paddingBottom: "1%",
        }
      }}
    // sx={drawerProps}
    // PaperProps={{
    //   sx: {
    //     width: {
    //       xs: "100%",
    //       md: "80%",
    //       lg: width || "35%",
    //     },
    //     padding: "40px 0px",
    //     paddingTop: 0,
    //     paddingBottom: "1%",
    //     height: "100vh",
    //     ...paperSx,
    //   },
    // }}
    >
      {renderHead}
      <Divider />
      {wrappedWithForm()}
    </Drawer>
  );
};
